"use strict";

const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config.js")
const db = require("../db");
const { BadRequestError, NotFoundError, UnauthorizedError } = require("../helpers/expressError");
const { sqlForPartialUpdate } = require("../helpers/sql.js");
const { calcDailyCal } = require("../helpers/calc");

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

      const dailyCal = await calcDailyCal(age, weight, height, gender, pal, goalWeight);

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
            goal_weight,
            daily_cal)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING username, first_name AS "firstName", last_name as "lastName", email, age, weight, height, gender, pal, goal_weight AS "goalWeight", daily_cal AS "dailyCal"`,
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
            goalWeight,
            dailyCal
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
                first_name AS "firstName",
                last_name AS "lastName",
                email,
                age, 
                weight, 
                height, 
                gender, 
                pal, 
                goal_weight AS "goalWeight",
                daily_cal AS "dailyCal"
         FROM users
         ORDER BY username`
      );
      return result.rows;
   }

   /** Given a username, return data about user
    * 
    * Returns {username, first_name, last_name, email, age, weight, height, gender, pal, goalWeight, dailyCal}
    * 
    * where recipes is {id, title, cuisine, ingredients, instructions}
    * 
    * Throws NotFoundError if user not found
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
                 goal_weight AS "goalWeight",
                 daily_cal AS "dailyCal"
         FROM users
         WHERE username = $1`,
         [username]
      );

      const user = userRes.rows[0];

      if (!user) throw new NotFoundError(`No user: ${username}`);

      const userRecipesRes = await db.query(
         `SELECT r.id
          FROM recipes AS r
          WHERE r.username = $1`,
         [username]
      );

      user.recipes = userRecipesRes.rows.map(r => r.id)

      const userFavoritesRes = await db.query(
         `SELECT f.recipe_id
          FROM favorites AS f
          WHERE f.username = $1`,
         [username]
      );

      user.favorites = userFavoritesRes.rows.map(f => f.recipe_id)

      return user;
   }

   /** UPDATE user data with `data`
    * 
    * This is a "partial update" --- it's find if data does not contain all the fields; only changes provided ones..
    * 
    * Data can include:
    *    {firstName, lastName, password, email, age, weight, height, gender, pal, goalWeight}
    * 
    * Recalculate daily_cal - update db daily_cal after user info is updated.
    * 
    * Returns {username, firstName, lastName, email, age, weight, height, gender, pal, goalWeight, dailyCal}
    * 
    * Throws NotFoundError if user not found.
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
                                  goal_weight AS "goalWeight",
                                  daily_cal AS "dailyCal"`;

      const result = await db.query(querySql, [...values, username]);
      const userUpdate = result.rows[0];

      if (!userUpdate) throw new NotFoundError(`No user: ${username}`);

      delete userUpdate.password;

      // Recalculate daily_cal
      const userRes = await db.query(
         `SELECT age, 
                 weight, 
                 height, 
                 gender, 
                 pal, 
                 goal_weight AS "goalWeight"
         FROM users
         WHERE username = $1`,
         [username]
      );
      // console.log(userRes.rows[0])
      const { age, weight, height, gender, pal, goalWeight } = userRes.rows[0];

      const recalc = calcDailyCal(age, weight, height, gender, pal, goalWeight)
      // console.log(recalc)

      const resultRecalc = await db.query(
         `UPDATE users
          SET daily_cal = $1
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
                     goal_weight AS "goalWeight",
                     daily_cal AS "dailyCal"`,
         [recalc, username]
      );
      const user = resultRecalc.rows[0];
      return user;
   };

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
   };
}

module.exports = User