"use strict";

const db = require("../db");


class Recipe {
   /** Create a recipe
    * 
    * update db, return new recipe data
    * 
    * data should be { title, cuisine, ingredients list, instructions, notes }
    * 
    * Returns { id, title, cuisine, ingredients list, instructions, notes }
    * 
    * Throws BadRequestError if recipe title already exists
    */
   static async create({ title, cuisine, ingredients, instructions, notes }) {
      const result = await db.query(
         `INSERT INTO recipes (title, 
                              cuisine, 
                              ingredients, 
                              instructions, 
                              notes)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, title, cuisine, ingredients, instructions, notes`,
         [
            title,
            cuisine,
            ingredients,
            instructions,
            notes
         ],
      );
      const recipe = result.rows[0]

      return recipe;
   }
}

module.exports = Recipe;