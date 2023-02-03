// "use strict";

/** Express app for kitchen aide */
const express = require("express");

const app = express();

const recipesRoutes = require("./routes/recipes")
const ExpressError = require("./helpers/expressError")

app.use(express.json())

app.use("/auth", (req, res) => {
   console.log('auth route works')
   res.send('auth route works!')
})
// app.use("/users", )
app.use("/recipes", recipesRoutes)
// app.use("/favorites")

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
   const err = new ExpressError("Not Found", 404)

   return next(err)
})

/** Generic error handler; anything unhandled goes here */
app.use(function (err, req, res, next) {
   if (process.env.NODE_ENV !== "test") console.error(err.stack);
   const status = err.status || 500;
   const message = err.message;

   return res.status(status).json({
      error: { message, status },
   });
});

// app.listen(3001, function () {
//    console.log('App on port 3001')
// })
module.exports = app;