"use strict";

const db = require("../db.js");
const User = require("../models/user");
const Recipe = require("../models/recipe");
const Favorite = require("../models/favorite");
const CalLog = require("../models/calLogWrapper");
const { createToken } = require("../helpers/tokens");

const favoriteIds = [];
const recipeIds = [];

async function commonBeforeAll() {

   await db.query("DELETE FROM users");
   await db.query("DELETE FROM recipes");
   await db.query("DELETE FROM favorites");
   await db.query("DELETE FROM calorie_log");

   await User.register({
      username: "u1",
      password: "password1",
      firstName: "U1F",
      lastName: "U2L",
      email: "user1@user.com",
      age: 21,
      weight: 111,
      height: 61,
      gender: "female",
      pal: 1.4,
      goalWeight: "lose",
   })
   await User.register({
      username: "u2",
      password: "password2",
      firstName: "U1F",
      lastName: "U2L",
      email: "user2@user.com",
      age: 21,
      weight: 111,
      height: 61,
      gender: "male",
      pal: 1.4,
      goalWeight: "lose",
   })

   let recipe1 = await Recipe.create({
      title: "Recipe1",
      cuisine: "Cuisine1",
      ingredients: "Ingredient1",
      instructions: "Instruction1",
      avg_cal: 1000,
      notes: "Note1",
      username: "u1"
   })
   let recipe2 = await Recipe.create({
      title: "Recipe2",
      cuisine: "Cuisine2",
      ingredients: "Ingredient2",
      instructions: "Instruction2",
      avg_cal: 2000,
      notes: "Note2",
      username: "u2"
   })

   recipeIds[0] = (recipe1.id);

   favoriteIds[0] = (recipe2.id);

   await Favorite.save("u1", favoriteIds[0])
}

async function commonBeforeEach() {
   await db.query("BEGIN");
}

async function commonAfterEach() {
   await db.query("ROLLBACK");
}

async function commonAfterAll() {
   favoriteIds.length = 0
   await db.end();
}

const u1Token = createToken({ username: "u1" });
const u2Token = createToken({ username: "u2" });


module.exports = {
   commonBeforeAll,
   commonBeforeEach,
   commonAfterEach,
   commonAfterAll,
   favoriteIds,
   recipeIds,
   u1Token,
   u2Token,
}