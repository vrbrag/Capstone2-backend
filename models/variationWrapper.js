"use strict";
const db = require("../db");

const Recipe = require("./recipe");
const Favorites = require("./favorite");
const Variation = require("./variation");

const BASE_URL = `https://api.spoonacular.com/recipes/`
const api_key = `2d3d04ef784549cb818fdb563237f29c`
// 2770a7c333e14ed397442fb4d705d3de

class VariationWrapper {

   static async favorite(id, username) {

      const variation = await Variation.getVarRecipe(id);

      const toRecipes = await Recipe.saveVar(variation.title, variation.cuisine, variation.ingredients, variation.instructions, variation.avg_cal, username);

      const recipeId = toRecipes.id;
      console.log(recipeId)

      const toFavorites = await Favorites.save(username, recipeId)

      return toFavorites;
   }
};

module.exports = VariationWrapper;