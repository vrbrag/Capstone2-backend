const express = require("express");
const router = new express.Router();
const jsonschema = require("jsonschema");
const { BadRequestError, NotFoundError } = require("../helpers/expressError");

const User = require("../models/user");
const userUpdateSchema = require("../schemas/userUpdate.json");
const Favorite = require('../models/favorite');
const { ensureCorrectUser } = require("../middleware/auth")

/** GET / => {users: [{username, firstName, lastName, email}]}
 *
 * Returns list of all users
 * 
 */
router.get("/", async function (req, res, next) {
   try {
      const users = await User.findAll()
      return res.json({ users })
   } catch (err) {
      return next(err)
   }
})

/** GET /[username] => {user}
 * 
 * Returns {username, firstName, lastName, email, age, weight, height, gender, pal, goalWeight}
 * 
 * 
 */
router.get("/:username", ensureCorrectUser, async function (req, res, next) {
   try {
      const user = await User.get(req.params.username);
      return res.json({ user })
   } catch (err) {
      return next(err)
   }
})

/** PATCH /[username] {user} => {user}
 * 
 * Data can include:
 *    {firstName, lastName, password, email, age, weight, height, gender, pal, goalWeight}
* 
* Returns {username, firstName, lastName, email, age, weight, height, gender, pal, goalWeight}
* 
Authorization: ....
*/
router.patch("/:username", ensureCorrectUser, async function (req, res, next) {
   try {
      const validator = jsonschema.validate(req.body, userUpdateSchema);
      if (!validator.valid) {
         const errs = validator.errors.map(e => e.stack);
         throw new BadRequestError(errs)
      }

      const user = await User.update(req.params.username, req.body);
      return res.json({ user });
   } catch (err) {
      return next(err)
   }
});

/** DELETE /[username] => {deleted: username}
 * 
 * Authorization required: same user as: username
*/
router.delete("/:username", ensureCorrectUser, async function (req, res, next) {
   try {
      await User.remove(req.params.username);
      return res.json({ deleted: req.params.username });
   } catch (err) {
      return next(err)
   }
});

/** GET / => {favorites: [{title, recipe_id, username}...]}
 *
 * Returns list of all of current user's favorited recipes.
 * 
 */
router.get("/:username/favorites", ensureCorrectUser, async function (req, res, next) {
   try {
      const favorites = await Favorite.findAll(req.params.username)
      return res.json({ favorites })
   } catch (err) {
      return next(err)
   }
});

module.exports = router;