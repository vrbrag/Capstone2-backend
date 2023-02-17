const express = require("express");
const router = new express.Router();
const jsonschema = require("jsonschema");
const { BadRequestError, NotFoundError } = require("../helpers/expressError");

const User = require("../models/user")

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

module.exports = router