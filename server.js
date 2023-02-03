"use strict";

const app = require("./app");
const { PORT } = require("./config");

app.listen(PORT, function () {
   console.log(`Start on http://localhost:${PORT}`);
});