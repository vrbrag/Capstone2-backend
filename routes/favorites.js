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
 * ***** 
 *       check if recipe is already favorited 
 *       by user in FE using State - 
 *       const [favoritedIds, setFavoritedIds] 
 *       = useState(new Set([]))
 * *****
 * Authorization: ensureLoggedIn
*/

// /:id
// (req.params.id, req.body.username)

router.post("/:id", async function (req, res, next) {
   try {
      const favorite = await Favorite.save(req.body.username, req.params.id)
      return res.json({ favorite });
   } catch (err) {
      return next(err);
   }
});

/** DELETE /[id] => {deleted: id} 
 * 
 * Authorization required: ensureCurrentUser
*/
router.delete("/:id", async function (req, res, next) {
   try {
      await Favorite.remove(req.params.id);
      return res.json({ deleted: req.params.id })
   } catch (err) {
      return next(err)
   }
});

module.exports = router;