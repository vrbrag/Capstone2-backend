const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/** return signed JWT from user data. */

function createToken(user) {
   // console.assert(user.Admin !== undefined);

   let payload = {
      username: user.username
   };

   return jwt.sign(payload, SECRET_KEY);
}

module.exports = { createToken };