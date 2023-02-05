const express = require("express");
const router = new express.Router();
const db = require("../db")

const Recipe = require("../models/recipe")

router.post("/", async function (req, res, next) {
   try {
      const recipe = await Recipe.create(req.body)
      // console.log(recipe)
      return res.status(201).json({ recipe })
   } catch (err) {
      return next(err)
   }
})

module.exports = router;