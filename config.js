
/** Shared config for application; can be required many places */

require("dotenv").config();
require("colors");

const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";
const PORT = +process.env.PORT || 3001;

// Use dev database, testing database, or via env var, production database
function getDatabaseUri() {
   return (process.env.NODE_ENV === "test") ? "kitchen_test" : process.env.DATABASE_URL || "kitchen";
}

console.log("Kitchen Config:".green);
console.log("SECRET_KEY:".yellow, SECRET_KEY);
console.log("PORT:".yellow, PORT.toString());

console.log("Database:".yellow, getDatabaseUri());
console.log("---");

module.exports = {
   SECRET_KEY,
   PORT,
   getDatabaseUri,
};