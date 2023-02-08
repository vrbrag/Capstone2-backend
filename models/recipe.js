"use strict";

const db = require("../db");
const { sqlForPartialUpdate } = require("../helpers/sql");
const { BadRequestError, NotFoundError } = require("../helpers/expressError");

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
            id,
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

   /** Update recipe 
    * 
    * Data can include: {title, ingredients, instructions, notes}
    * 
    * Returns {id, title, ingredients, instructions, notes}
    * 
    * Throws NotFoundEror if not found
    */
   static async update(id, data) {
      const { setCols, values } = sqlForPartialUpdate(data)

      const handleVarIdx = "$" + (values.length + 1);
      const querySql = `UPDATE recipes
                        SET ${setCols}
                        WHERE id = ${handleVarIdx}
                        RETURNING id,
                                  title,
                                  cuisine,
                                  ingredients,
                                  instructions,
                                  notes`

      const result = await db.query(querySql, [...values, id]);
      const recipe = result.rows[0];

      if (!recipe) throw new NotFoundError(`No recipe: ${id}`)
      return recipe;
   }

   /** Delete recipe from database
    * 
    * returns undefined.
    * 
    * Throws NotFoundError if recipe not found
    */
   static async remove(id) {
      const result = await db.query(
         `DELETE 
         FROM recipes
         WHERE id = $1
         RETURNING id`,
         [id]
      );
      const recipe = result.rows[0];

      if (!recipe) throw new NotFoundError(`No recipe: ${id}`)
   }
}

module.exports = Recipe;