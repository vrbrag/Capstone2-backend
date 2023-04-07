"use strict";

const Recipe = require("./recipe");
const Favorites = require("./favorite");
const CalLogWrapper = require("./calLogWrapper")


/** Favorite and Log Variation Recipe
 * 
 * variation recipes suggested from spoonacular API, user can:
 *    - favorite a recipe
 *    - log calories to daily calorie tracker
 *    - BOTH actions will also save recipe to db Recipes if it's not already saved.
 * 
 */
class VariationWrapper {

   /** Favorite variation recipe
    *    - preChecks/saves recipe to db Recipes 
    *    - If user unfavorites it, they can find recipe in future again.
    * 
    */
   static async favorite({ id, title, cuisine, ingredients, instructions, avg_cal, username }) {

      // check if variation is already saved in db Recipes
      // if not, save to Recipes
      const preCheck = await Recipe.get(id);

      if (!preCheck) {
         const toRecipes = await Recipe.saveVar(id, title, cuisine, ingredients, instructions, avg_cal, username);

         // const recipeId = toRecipes.id;
         // console.log(`RecipeId: ${recipeId}`)
         // console.log(`Id: ${id}`)
      }

      // save variation recipe to user's Favorites
      const favorite = await Favorites.save(username, id);

      return favorite;
   }

   /** Log variation recipe
    * 
    *    - preChecks/saves recipe to db Recipes 
    *    - If user unfavorites it, they can find recipe in future again.
    */
   static async log({ id, title, cuisine, ingredients, instructions, avg_cal, username }) {

      // check if variation is already saved in db Recipes
      // if not, save to Recipes
      const preCheck = await Recipe.get(id);

      if (!preCheck) {
         const toRecipes = await Recipe.saveVar(id, title, cuisine, ingredients, instructions, avg_cal, username);

         // const recipeId = toRecipes.id;
         // console.log(`RecipeId: ${recipeId}`)
         // console.log(`Id: ${id}`)
      }

      let currentDate = new Date().toJSON().slice(0, 10);

      const log = await CalLogWrapper.log(username, id, currentDate);

      return log;
   }
};

module.exports = VariationWrapper;