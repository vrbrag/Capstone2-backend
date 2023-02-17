"use strict";

const bcrypt = require("bcrypt");
const { UnauthorizedError } = require("../../../Projects/React-jobly/jobly/react-jobly/backend/expressError.js");
const { BCRYPT_WORK_FACTOR } = require("../config.js")
const db = require("../db");
const { BadRequestError, NotFoundError } = require("../helpers/expressError");
const { sqlForPartialUpdate } = require("../helpers/sql.js");

class User {

   /** Authenticate user with username, password.
    * 
    * Returns {username, first_name, last_name, email}
    * 
    * Throws UnauthorizedError if user is not found or wrong password.
    */
   static async authenticate(username, password) {
      // try  to find the user first
      const result = await db.query(
         `SELECT username,
                 password,
                 first_name AS "firstName",
                 last_name AS "lastName",
                 email
         FROM users
         WHERE username = $1`,
         [username]
      );

      const user = result.rows[0];

      if (user) {
         // compare hashed password to a new hash from password
         const isValid = await bcrypt.compare(password, user.password);
         if (isValid === true) {
            delete user.password;
            return user;
         }
      }

      throw new UnauthorizedError("Invalid username/password");
   }


   /** Register user with data
    * 
    * Returns {username, firstName, lastName, email, age, weight, height, gender, pal, goalWeight}
    * 
    * Throws BadRequestError on duplicates.
    */
   static async register(
      { username, password, firstName, lastName, email, age, weight, height, gender, pal, goalWeight }) {

      const duplicateCheck = await db.query(
         `SELECT username
         FROM users
         WHERE username = $1`,
         [username]
      );

      if (duplicateCheck.rows[0]) {
         throw new BadRequestError(`Duplicate username: ${username}`);
      }

      const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

      const result = await db.query(
         `INSERT INTO users
            (username,
            password,
            first_name,
            last_name,
            email,
            age,
            weight,
            height,
            gender,
            pal,
            goal_weight)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING username, first_name AS "firstName", last_name as "lastName", email, age, weight, height, gender, pal, goal_weight AS "goalWeight"`,
         [
            username,
            hashedPassword,
            firstName,
            lastName,
            email,
            age,
            weight,
            height,
            gender,
            pal,
            goalWeight
         ]
      );

      const user = result.rows[0];
      return user;
   }

   /** Find All users 
    * 
    * Returns [{username, first_name, last_name, email}, ...]
   */
   static async findAll() {
      const result = await db.query(
         `SELECT username,
                first_name AS firstName,
                last_name AS lastName,
                email,
                age, 
                weight, 
                height, 
                gender, 
                pal, 
                goal_weight AS "goalWeight"
         FROM users
         ORDER BY username`
      );
      return result.rows;
   }

   /** Given a username, return data about user
    * 
    * Returns {username, first_name, last_name, email,}
    */
   static async get(username) {
      const userRes = await db.query(
         `SELECT username,
                 first_name AS "firstName",
                 last_name AS "lastName",
                 email, 
                 age, 
                 weight, 
                 height, 
                 gender, 
                 pal, 
                 goal_weight AS "goalWeight"
         FROM users
         WHERE username = $1`,
         [username]
      );

      const user = userRes.rows[0];

      if (!user) throw new NotFoundError(`No user: ${username}`);

      return user;
   }

   /** UPDATE user data with `data`
    * 
    * This is a "partial update" --- it's find if data does not contain all the fields; only changes provided ones..
    * 
    * Data can include:
    *    {firstName, lastName, password, email, age, weight, height, gender, pal, goalWeight}
    * 
    * Returns {username, firstName, lastName, email, age, weight, height, gender, pal, goalWeight}
    * 
    * Throws NotFoundError if not found.
    * 
    */

   static async update(username, data) {
      if (data.password) {
         data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
      }

      const { setCols, values } = sqlForPartialUpdate(
         data,
         {
            firstName: "first_name",
            lastName: "last_name",
            goalWeight: "goal_weight"
         }
      );

      const usernameVarIdx = "$" + (values.length + 1);

      const querySql = `UPDATE users
                        SET ${setCols}
                        WHERE username = ${usernameVarIdx}
                        RETURNING username,
                                  first_name AS "firstName",
                                  last_name AS "lastName",
                                  email,
                                  age,
                                  weight, 
                                  height,
                                  gender,
                                  pal,
                                  goal_weight AS "goalWeight"`;

      const result = await db.query(querySql, [...values, username]);
      const user = result.rows[0];

      if (!user) throw new NotFoundError(`No user: ${username}`);

      delete user.password;
      return user;
   }

   /** DELETE /[username] 
    * 
    * Delete given user from database.
    * Returns undefined.
   */
   static async remove(username) {
      let result = await db.query(
         `DELETE 
         FROM users
         WHERE username = $1
         RETURNING username`,
         [username]
      );
      const user = result.rows[0];

      if (!user) throw new NotFoundError(`No user: ${username}`);
   }
}

module.exports = User