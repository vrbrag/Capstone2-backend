"use strict";

const db = require("../db");
const { NotFoundError } = require("../helpers/expressError");


class Favorites {
   /** Find user's favorited recipes
    * 
    * Returns [{title, recipe_id}]
    */
   static async findAll(username) {
      const result = await db.query(
         `SELECT id,
                 title,
                 recipe_id,
                 username
         FROM favorites
         WHERE username = $1`,
         [username]
      );

      const favorites = result.rows;

      return favorites;
   }

   /** Save recipe to favorites
    * 
    * data should be {title, recipe_id, username}
    * 
    * Returns { recipe_id, title, username}
    */
   static async save({ recipeId, title, username }) {
      const result = await db.query(
         `INSERT INTO favorites (recipe_id,
                                 title, 
                                 username)
         VALUES ($1, $2, $3)
         RETURNING id, recipe_id AS "recipeId", username`,
         [
            recipeId,
            title,
            username
         ]
      );

      const favorite = result.rows[0];
      return favorite;
   };

   /** Remove favorited recipe from favorites
    * 
    * returns undefined.
    * 
    * Throws NotFoundError if recipe not found.
    */
   static async remove(id) {
      const result = await db.query(
         `DELETE 
         FROM favorites
         WHERE id = $1
         RETURNING id`,
         [id]
      );
      const favorite = result.rows[0];

      if (!favorite) throw new NotFoundError(`No favorite recipe: ${id}`)
   }
};

module.exports = Favorites;