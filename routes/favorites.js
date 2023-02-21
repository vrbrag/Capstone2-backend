const express = require("express");
const router = new express.Router();

const Favorite = require("../models/favorite")

/** GET / => {favorites: [{title, recipe_id, username}]}
 *
 * Returns list of all of current user's favorited recipes.
 * 
 */
router.get("/:username", async function (req, res, next) {
   try {
      const favorites = await Favorite.findAll(req.params.username)
      return res.json({ favorites })
   } catch (err) {
      return next(err)
   }
});

/** SAVE recipe to favorites => see recipe routes  */

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