const express = require("express");
const router = new express.Router();
const db = require("../db")

const Recipe = require("../models/recipe")

/** POST / {recipe} => {recipe} 
 * 
 * recipe should be { title, cuisine, ingredients, instructions, notes, username }
 * 
 * Returns { title, cuisine, ingredients, instructions, notes, username }
*/
router.post("/add", async function (req, res, next) {
   try {
      const recipe = await Recipe.create(req.body)
      // console.log(recipe)
      return res.status(201).json({ recipe })
   } catch (err) {
      return next(err)
   }
})

/** GET / => {recipes: [{ title, cuisine, ingredients, instructions, notes, username }...]} 
*/
router.get("/", async function (req, res, next) {
   try {
      const recipes = await Recipe.findAll()
      return res.json({ recipes })
   } catch (err) {
      return next(err)
   }
})

/** GET / {search} => {recipes: [{ title, cuisine, ingredients, instructions, notes, username }...]}  
 * 
 * Search filter in query:
 * - cuisine
 * - ingredients
 * - title?
*/


module.exports = router;