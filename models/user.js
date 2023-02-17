"use strict";

const bcrypt = require("bcrypt");
const { UnauthorizedError } = require("../../../Projects/React-jobly/jobly/react-jobly/backend/expressError.js");
const { BCRYPT_WORK_FACTOR } = require("../config.js")
const db = require("../db");
const { BadRequestError } = require("../helpers/expressError");

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

}

module.exports = User