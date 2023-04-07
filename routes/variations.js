const express = require("express");
const router = new express.Router();

const { NotFoundError } = require("../helpers/expressError");

const Recipe = require("../models/recipe")
const Variation = require("../models/variation");
const VariationWrapper = require("../models/variationWrapper");

/** GET /[recipeId] = { variations : [] } 
 * 
 * Returns [{api_id, title, image, imageType},...]
 * 
 * Authorization: ensureCurrentUser
*/
router.get("/bycuisine/:id", async function (req, res, next) {
   try {
      const recipe = await Recipe.get(req.params.id);

      if (!recipe) throw new NotFoundError(`No recipe: ${id}`)

      const cuisine = recipe.cuisine;

      const variations = await Variation.getCuisineVar(cuisine);
      return res.json({ variations });

   } catch (err) {
      return next(err);
   }
});

/** GET /[recipeId] = {variations: []}
 * 
 * Returns [{api_id, title, image, imageType},...]
 * 
 * 
*/
router.get("/byingredients/:id", async function (req, res, next) {
   try {
      const recipe = await Recipe.get(req.params.id);

      if (!recipe) throw new NotFoundError(`No recipe: ${id}`)

      const ingredients = recipe.ingredients;

      const variations = await Variation.getIngredientsVar(ingredients);

      return res.json({ variations });

   } catch (err) {
      return next(err);
   }
})

/** GET /[variationId] = [recipe] 
 * 
 * pass in variation ID
 * 
 * Returns [{id, title, image, cuisines, instructions, extendedIngredients}]
 * 
*/
router.get("/recipe/:id", async function (req, res, next) {
   try {
      const recipe = await Variation.getVarRecipe(req.params.id)

      return res.json({ recipe })

   } catch (err) {
      return next(err)
   }
})

/** POST /[variation recipe] = { favorite }
 * 
 *  *** req.body = recipe data after getVarRecipe
 * 
 * recipe data {id, title, cuisine, ingredients, instructions, avg_cal, username}
 * 
 * Returns "favorite": {{recipeId, title, username }}
 * 
 * Authorization: ensureLoggedIn
*/
router.post("/favorite", async function (req, res, next) {
   try {
      const favorite = await VariationWrapper.favorite(req.body)

      return res.json({ favorite })
   } catch (err) {
      return next(err);
   }
});

/** POST /[variation recipe] = { log } 
 * 
 *   *** req.body = recipe data after getVarRecipe
 * 
 * recipe data {id, title, cuisine, ingredients, instructions, avg_cal, username}
 * 
 * Returns "log": {id, username, dailyTotal, recipeIds, date, isGoal}
 * 
*/
router.post("/log", async function (req, res, next) {
   try {

      const log = await VariationWrapper.log(req.body);

      return res.json({ log });

   } catch (err) {
      return next(err);
   }
})

module.exports = router;