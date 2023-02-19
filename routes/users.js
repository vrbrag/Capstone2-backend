const express = require("express");
const router = new express.Router();
const jsonschema = require("jsonschema");
const { BadRequestError, NotFoundError } = require("../helpers/expressError");

const User = require("../models/user")
const userUpdateSchema = require("../schemas/userUpdate.json")
const DailyCal = require("../models/dailyCal");
const userCalCalcSchema = require("../schemas/userCalCalc.json");

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
router.get("/:username", async function (req, res, next) {
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
router.patch("/:username", async function (req, res, next) {
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
router.delete("/:username", async function (req, res, next) {
   try {
      await User.remove(req.params.username);
      return res.json({ deleted: req.params.username });
   } catch (err) {
      return next(err)
   }
});

router.post("/:username", async function (req, res, next) {
   try {
      const calc = await DailyCal.calculateCal({ ...req.body, userCalCalcSchema })
      console.log(calc)
      return res.json({ calc })

   } catch (err) {
      return next(err)
   }
})

module.exports = router