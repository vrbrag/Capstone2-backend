"use strict";

const db = require("../db");
const { calcDailyCal } = require("../helpers/calc");
const { NotFoundError, BadRequestError } = require("../helpers/expressError");
const User = require("./user");

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
   static async getRecipeAvgCal(recipeId) {
      // console.log(`getRecipeAvgCal method: ${recipeId}`)
      const result = await db.query(
         `SELECT avg_cal
         FROM recipes
         WHERE id = $1`,
         [recipeId]
      )

      const recipeCalories = result.rows[0]
      // console.log(`Retrieved recipe calories:`, recipeCalories)
      if (!recipeCalories) throw new NotFoundError(`Cannot get avgCal of recipe: ${recipeId}`)

      // console.log(`recipeCalories Value:`, recipeCalories.avg_cal);
      return recipeCalories.avg_cal;
   }

   /** Check if users daily calorie goal is met 
    * 
    * if daily_cal > todaysCalorieTotal 
    *    goal is not met => return false 
    */
   static async checkDailyGoal(username, todaysCalorieTotal) {
      console.log(`checkDailyGoal:`, username, todaysCalorieTotal)

      const result = await User.get(username)
      // console.log(`Result user:`, result)

      const userDailyCal = result.dailyCal
      // console.log(userDailyCal)
      console.log(`userDailyCal:`, userDailyCal)

      if (userDailyCal >= todaysCalorieTotal) {
         return false;
      } else {
         return true;
      };
   }

   /** Pre Check if user already has a calorie log for today 
    * 
    * data {username, date}
    * 
    * RETURNS {id}
    */
   static async preCheck(username, date) {

      const preCheck = await db.query(
         `SELECT id
         FROM calorie_log
         WHERE username = $1 and date = $2`,
         [
            username,
            date
         ]
      );

      if (!preCheck.rows[0]) {
         return false
      } else {
         const id = preCheck.rows[0].id
         // console.log(`preCheck id=${id}`);
         return id
      }
   };
};

module.exports = DailyCal;