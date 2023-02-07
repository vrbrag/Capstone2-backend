"use strict";

const db = require("../db");


class Recipe {
   /** Create a recipe
    * 
    * update db, return new recipe data
    * 
    * data should be { title, cuisine, ingredients list, instructions, notes, username }
    * 
    * Returns { id, title, cuisine, ingredients list, instructions, notes, username }
    * 
    * Throws BadRequestError if recipe title already exists
    */
   static async create({ title, cuisine, ingredients, instructions, notes }) {
      const result = await db.query(
         `INSERT INTO recipes (title, 
                              cuisine, 
                              ingredients, 
                              instructions, 
                              notes,
                              username)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, title, cuisine, ingredients, instructions, notes, username`,
         [
            title,
            cuisine,
            ingredients,
            instructions,
            notes,
            username
         ],
      );
      const recipe = result.rows[0]

      return recipe;
   }

   /** Find all recipes
    * 
    * searchFilters?
    * 
    * Returns [{title, cuisine, ingredients, instructions, notes, username }]
    */
   static async findAll() {
      const result = await db.query(
         `SELECT 
            title,
            cuisine,
            ingredients,
            instructions,
            notes,
            username
         FROM recipes`
      );

      const recipes = result.rows;
      return recipes;
   }


}

module.exports = Recipe;