const express = require("express");
const router = new express.Router();
const db = require("../db")

router.get("/", async function (req, res, next) {
   try {
      const results = await db.query(
         `SELECT title, cuisine, username FROM recipes;`
      )
      return res.json(results.rows)
   } catch (err) {
      return next(err)
   }
})

module.exports = router;