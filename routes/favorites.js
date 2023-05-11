const express = require("express");
const router = new express.Router();

const Favorite = require("../models/favorite")
const { ensureCorrectUser, ensureLoggedIn } = require("../middleware/auth")


/** SAVE recipe to favorites => see recipe routes  */
/** POST /{recipe} => {favorite recipe} 
 * 
 * recipe data {recipeId, username}
 * 
 * Returns {recipeId, title, username }
 *  - pulls title from recipeId
 * 
 * ***** 
 *       check if recipe is already favorited 
 *       by user in FE using State - 
 *       const [favoritedIds, setFavoritedIds] 
 *       = useState(new Set([]))
 * *****
 * Authorization: ensureLoggedIn
*/


router.post("/:username/:id", ensureLoggedIn, async function (req, res, next) {
   try {
      const recipeId = +req.params.id
      const favorite = await Favorite.save(req.params.username, recipeId)
      return res.json({ favorite });
   } catch (err) {
      return next(err);
   }
});

/** DELETE /[id] => {deleted: id} 
 * 
 * Authorization required: ensureCurrentUser
*/
router.delete("/:username/:id", ensureCorrectUser, async function (req, res, next) {
   try {
      const recipeId = req.params.id
      await Favorite.remove(req.params.username, recipeId);
      return res.json({ deleted: recipeId })
   } catch (err) {
      return next(err)
   }
});

module.exports = router;