const express = require("express");
const router = new express.Router();
const { BadRequestError, NotFoundError } = require("../helpers/expressError");
const CalorieLog = require("../models/calLog");
const CalLogWrapper = require("../models/calLogWrapper");
const DailyCal = require("../models/dailyCal");
const { ensureCorrectUser } = require("../middleware/auth")

/** POST /{calLog: [{username, dailyTotal, recipeIds, date, isGoal}]}
 * 
 * Authorization: ensureCurrentUser
 */
router.post("/log", ensureCorrectUser, async function (req, res, next) {
   try {
      let currentDate = new Date().toJSON().slice(0, 10);

      console.log(`Current Date: ${currentDate}`);

      // const { username } = req.body.username;
      // const { recipeId } = req.body.recipeId;

      // const preCheck = await DailyCal.preCheck(username, currentDate);


      // console.log(`route preCheck`, preCheck)
      // console.log(`in route: preCheck`, id)
      // if (id) {

      //    const log = await CalorieLog.add(username, recipeId, id);

      //    return res.json({ log });
      // } else {
      //    const log = await CalorieLog.create(username, recipeId, currentDate);

      //    return res.json({ log });

      const log = await CalLogWrapper.log(req.body.username, req.body.recipeId, currentDate);

      return res.json({ log });


   } catch (err) {
      return next(err);
   }
})

/** Try add to existing day log */
// router.post("/add", async function (req, res, next) {
//    try {
//       let currentDate = new Date().toJSON().slice(0, 10);

//       // let currentDate = '2023-03-15'
//       console.log(`Current Date: ${currentDate}`);

//       const log = await CalorieLog.add(req.body.username, req.body.recipeId, currentDate);

//       return res.json({ log });

//    } catch (err) {
//       return next(err);
//    }
// })

module.exports = router;