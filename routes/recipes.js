const express = require("express");
const router = new express.Router();
const jsonschema = require("jsonschema");
const { BadRequestError } = require("../helpers/expressError");

const Recipe = require("../models/recipe")
const recipeUpdateSchema = require("../schemas/recipeUpdate.json")
const recipeNewSchema = require("../schemas/recipeNew.json")
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth")

/** POST / {recipe} => {recipe} 
 * 
 * recipe should be { title, cuisine, ingredients, instructions, notes, username }
 * 
 * Returns { title, cuisine, ingredients, instructions, notes, username }
*/
router.post("/add", ensureLoggedIn, async function (req, res, next) {
   try {
      const validator = jsonschema.validate(req.body, recipeNewSchema);
      if (!validator.valid) {
         const errs = validator.errors.map(e => e.stack);
         throw new BadRequestError(errs)
      }
      const recipe = await Recipe.create(req.body)
      // console.log(recipe)
      return res.status(201).json({ recipe })
   } catch (err) {
      return next(err)
   }
})

/** GET / => {recipes: [{ title, cuisine, ingredients, instructions, notes, username }...]} 
 * 
 * Can search by:
 *  - title
 *  - cuisine
 *  - ingredients
 * 
 * Authorization: none
*/
router.get("/", async function (req, res, next) {
   const q = req.query;
   try {
      const recipes = await Recipe.findAll(q)
      return res.json({ recipes })
   } catch (err) {
      return next(err)
   }
});

/** GET /[recipeId] => { recipe }
 * 
 * Returns { id, title, cuisine, ingredients, instructions }
 * 
 * Authorization: none
 */
router.get("/:id", async function (req, res, next) {
   try {
      const recipe = await Recipe.get(req.params.id);
      return res.json({ recipe });
   } catch (err) {
      return next(err)
   }
});

/** PATCH /[id] {fld1, fld2, ...} => {recipe}
 * 
 * Patches recipe data.
 * 
 *  **data must include { title, username }
 * 
 * fields to update can be: {title, cuisine, ingredients, instructions, notes}
 * 
 * Returns {id, title, cuisine, ingredients, instructions, notes}
 * 
 * Authorization: ensureCurrentUser
*/
router.patch("/:id", ensureCorrectUser, async function (req, res, next) {
   try {
      const validator = jsonschema.validate(req.body, recipeUpdateSchema);
      if (!validator.valid) {
         const errs = validator.errors.map(e => e.stack);
         throw new BadRequestError(errs);
      }
      // const { username } = req.body;
      const recipe = await Recipe.update(req.params.id, req.body);
      return res.json({ recipe });
   } catch (err) {
      return next(err)
   }
})

/** DELETE /[id] => {deleted: id} 
 * 
 * Authorization: ensureCurrentUser
*/
router.delete("/:id", ensureCorrectUser, async function (req, res, next) {
   try {
      await Recipe.remove(req.params.id);
      return res.json({ deleted: req.params.id });
   } catch (err) {
      return next(err)
   }
})

module.exports = router;