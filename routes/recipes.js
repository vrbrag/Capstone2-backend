const express = require("express");
const router = new express.Router();
const jsonschema = require("jsonschema");
const { BadRequestError, NotFoundError } = require("../helpers/expressError");

const Favorite = require("../models/favorite")
const Recipe = require("../models/recipe")
const recipeUpdateSchema = require("../schemas/recipeUpdate.json")
const recipeNewSchema = require("../schemas/recipeNew.json")

/** POST / {recipe} => {recipe} 
 * 
 * recipe should be { title, cuisine, ingredients, instructions, notes, username }
 * 
 * Returns { title, cuisine, ingredients, instructions, notes, username }
*/
router.post("/add", async function (req, res, next) {
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

/** POST /{recipe} => {favorite recipe} 
 * 
 * recipe data {recipeId, username}
 * 
 * Returns {recipeId, title, username }
 *  - pulls title from recipeId
 * 
 * ***** want to be able to favorite a recipe 
 *       on list of all recipes.....
 *       
 *       check if recipe is already favorited 
 *       by user in FE using State - 
 *       const [favoritedIds, setFavoritedIds] 
 *       = useState(new Set([]))
 * *****
*/

router.post("/:username/:id", async function (req, res, next) {
   try {
      const recipeId = +req.params.id;
      // console.log(recipeId)
      // console.log(req.params.username)
      const favorite = await Favorite.save(req.params.username, recipeId)
      return res.json({ favorite });
   } catch (err) {
      return next(err);
   }
});

/** PATCH /[id] {fld1, fld2, ...} => {recipe}
 * 
 * Patches recipe data.
 * 
 * fields can be: {title, cuisine, ingredients, instructions, notes}
 * 
 * Returns {id, title, cuisine, ingredients, instructions, notes}
*/


router.patch("/:id", async function (req, res, next) {
   try {
      const validator = jsonschema.validate(req.body, recipeUpdateSchema);
      if (!validator.valid) {
         const errs = validator.errors.map(e => e.stack);
         throw new BadRequestError(errs);
      }
      const recipe = await Recipe.update(req.params.id, req.body);
      return res.json({ recipe });
   } catch (err) {
      return next(err)
   }
})

/** DELETE /[id] => {deleted: id} 
 * 
 * 
*/
router.delete("/:id", async function (req, res, next) {
   try {
      await Recipe.remove(req.params.id);
      return res.json({ deleted: req.params.id });
   } catch (err) {
      return next(err)
   }
})

module.exports = router;