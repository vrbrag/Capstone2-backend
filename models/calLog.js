"use strict";

const db = require("../db");
const DailyCal = require("./dailyCal");

class CalorieLog {

   /** Create new daily calorie log
    * 
    */
   static async create(username, recipeId, date) {
      // console.log(username, recipeId, date)
      // INSERT log into database calLog
      const dailyTotal = await DailyCal.getRecipeAvgCal(recipeId)
      // console.log(`DailyTotal:`, dailyTotal)

      // Check if user's daily calorie goal is met

      const isGoal = await DailyCal.checkDailyGoal(username, dailyTotal)
      console.log(`isGoal:`, isGoal)


      const result = await db.query(
         `INSERT INTO calorie_log (username,
                               daily_total,
                               recipe_ids,
                               date,
                               is_goal)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, username, daily_total AS "dailyTotal", recipe_ids AS "recipeIds", date, is_goal AS "isGoal"`,
         [
            username,
            dailyTotal,
            [recipeId],
            date,
            isGoal
         ]
      );

      const logRecipe = result.rows[0];
      console.log(logRecipe)

      return logRecipe;
   }


   /** Add recipe to existing db daily calorie log
    * 
    * Add where username and date are current:
    *    - insert recipeId to recipeIds list
    *    - update total calories - dailyTotal
    *    - update if goal is met - isGoal
    * 
    */

   static async add(username, recipeId, date) {
      // Add avgCal of each Recipe in today's log
      const preCheck = await db.query(
         `SELECT id
         FROM calorie_log
         WHERE username = $1`,
         [
            username
         ]
      );
      const id = preCheck.rows[0].id
      console.log(`preCheck id=${id}`)

      const getRecipes = await db.query(
         `SELECT recipe_ids AS "recipeIds"
          FROM calorie_log
          WHERE id = $1 `,
         [id]
      );

      const recipes = getRecipes.rows[0].recipeIds

      console.log(`recipes=${recipes}, type=`, typeof (recipes));

      const recipeIds = [...recipes, recipeId];
      // const recipeIdsCalories = recipeIds.map(r => (await DailyCal.getRecipeAvgCal(r)))
      console.log(`recipeIds = ${recipeIds}`)
      const recipeIdsCalories = await Promise.all(recipeIds.map(r => DailyCal.getRecipeAvgCal(r)));

      const dailyTotal = recipeIdsCalories.reduce((a, b) => a + b, 0);
      console.log(`dailyTotal =`, dailyTotal)

      // Check if user's daily calorie goal is met

      const isGoal = await DailyCal.checkDailyGoal(username, dailyTotal)

      console.log(`isGoal:`, isGoal)

      const result = await db.query(
         `UPDATE calorie_log
         SET recipe_ids = $1,
             daily_total = $2,
             is_goal = $3
         WHERE id = $4
         RETURNING username,
                   daily_total AS "dailyTotal",
                   recipe_ids AS "recipeIds",
                   date,
                   is_goal AS "isGoal"`,
         [
            recipeIds,
            dailyTotal,
            isGoal,
            id
         ]
      )

      const log = result.rows[0];

      return log;
   }
};

module.exports = CalorieLog;