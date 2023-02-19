"use strict";

const db = require("../db");
const { calcDailyCal } = require("../helpers/calc");
const { BadRequestError, NotFoundError } = require("../helpers/expressError");

class DailyCal {

   /** Initialize daily calorie calculation
    * 
    * data should be {username, age, weight, height, gender, pal, goalWeight}
    * 
    * Returns {username, calGoal, dailytotal, recipeIds, data}
    */

   static async calculateCal({ username, age, weight, height, gender, pal, goalWeight }) {
      const calGoal = calcDailyCal(age, weight, height, gender, pal, goalWeight);


      const result = await db.query(
         `INSERT INTO daily_cal
            (username, 
            cal_goal)
            VALUES ($1, $2)
            RETURNING username, cal_goal AS "calGoal"`,
         [
            username,
            calGoal
         ]
      );
      const initializeCalorieGoal = result.rows[0];
      return initializeCalorieGoal;
   }

   /** UPDATE and keep log of daily calorie intake */

};

module.exports = DailyCal;