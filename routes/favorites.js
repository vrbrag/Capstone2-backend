const express = require("express");
const router = new express.Router();

const Favorite = require("../models/favorite")



/** SAVE recipe to favorites => see recipe routes  */
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

// /:id
// (req.params.id, req.body.username)

router.post("/:id", async function (req, res, next) {
   try {
      const recipeId = +req.params.id;
      const favorite = await Favorite.save(req.body.username, recipeId)
      return res.json({ favorite });
   } catch (err) {
      return next(err);
   }
});

/** DELETE /[id] => {deleted: id} 
 * 
 * Authorization required: ensureCurrentUser.....
*/
router.delete("/:username/:id", async function (req, res, next) {
   try {
      await Favorite.remove(req.params.id);
      return res.json({ deleted: req.params.id })
   } catch (err) {
      return next(err)
   }
});

module.exports = router;