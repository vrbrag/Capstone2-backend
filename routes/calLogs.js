const express = require("express");
const router = new express.Router();
const { BadRequestError, NotFoundError } = require("../helpers/expressError");
const CalorieLog = require("../models/calLog");

/** POST /{calLog: [{username, dailyTotal, recipeIds, date, isGoal}]}
 * 
 * Authorization: ensureCurrentUser
 */
router.post("/log", async function (req, res, next) {
   try {
      let currentDate = new Date().toJSON().slice(0, 10);

      // let currentDate = '2023-03-15'
      console.log(`Current Date: ${currentDate}`)

      const log = await CalorieLog.create(req.body.username, req.body.recipeId, currentDate);
      return res.json({ log });
   } catch (err) {
      return next(err);
   }
})

module.exports = router;