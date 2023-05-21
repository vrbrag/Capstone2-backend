"use strict";

const DailyCal = require("./dailyCal");
const CalorieLog = require("./calLog")

class CalLogWrapper {
   static async log(username, recipeId, date) {

      // console.log(username, recipeId, date)
      const preCheck = await DailyCal.preCheck(username, date);

      // const id = res.json({ preCheck })
      // console.log(`preCheck =`, preCheck)
      // console.log(`in route: preCheck`, id)

      if (preCheck) {
         console.log(`ADD LOG`)
         let id = preCheck;

         const log = await CalorieLog.add(username, recipeId, id);

         return log;
      } else {
         console.log(`CREATE LOG`, username, recipeId)
         const log = await CalorieLog.create(username, recipeId, date);

         return log;

      }
   }
}

module.exports = CalLogWrapper;