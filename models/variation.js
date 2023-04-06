"use strict";
const db = require("../db");

const { default: axios } = require("axios");

const BASE_URL = `https://api.spoonacular.com/recipes/`
const api_key = `2d3d04ef784549cb818fdb563237f29c`
// 2770a7c333e14ed397442fb4d705d3de

class Variation {

   /** Get recipe by Cuisine
    *
    * data RECIPE { cuisine }
    * 
    * Returns {api_id, title, image}
    */
   static async getCuisineVar(search) {

      const url = `${BASE_URL}complexSearch?apiKey=${api_key}&cuisine=${search}`;
      console.log(url);
      const response = await axios.get(url);

      const data = response.data.results;

      return data;
   }

   /** Get recipe by ingredients 
    * 
    * data RECIPE { ingredients } array
    * 
    * Returns  {api_id, title, image}
    *  - limit 5
   */
   static async getIngredientsVar(ingredients) {

      // ["Rice", "Seaweed", "Ahi"] ==> rice,+seaweed,+ahi
      const result = ingredients.join(',+').toLowerCase();

      const url = `${BASE_URL}findByIngredients?apiKey=${api_key}&ingredients=${result}&number=5`;
      console.log(url);
      const response = await axios.get(url);

      const data = response.data;

      const recipes = data.map(r => ({
         id: r.id,
         title: r.title,
         image: r.image
      }))

      return recipes;
   }

   /** Get recipe by variation id 
    * 
    * Returns  {api_id, title, cuisine, ingredients, instructions, avg_cal, image}
   */
   static async getVarRecipe(id) {

      const url = `${BASE_URL}${id}/information?apiKey=${api_key}&includeNutrition=true`;
      console.log(url);

      const response = await axios.get(url);
      const data = response.data;

      const ingredients = data.extendedIngredients.map(r => r.name)
      const avg_cal = data.nutrition.nutrients[0].amount;

      const recipe = {
         id: data.id,
         title: data.title,
         cuisine: data.cuisines[0],
         ingredients: ingredients,
         instructions: data.instructions,
         avg_cal: avg_cal,
         // image: data.image
      };


      return recipe;
   }
}

module.exports = Variation;
