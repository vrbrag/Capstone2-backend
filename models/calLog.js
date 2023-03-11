"use strict";

const db = require("../db");
const { calcDailyCal } = require("../helpers/calc");
const { BadRequestError, NotFoundError } = require("../helpers/expressError");

class CalorieLog {

   /** Add recipe to daily calorie log
    * 
    * Add total calories
    * Add recipeId to list of recipes for each day
    * Determine if calorie goal is met
    */
   static async add(username, recipeId) {


   }
};

module.exports = CalorieLog;