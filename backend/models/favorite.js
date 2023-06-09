"use strict";

const db = require("../db");
const Recipe = require("../models/recipe");
const { NotFoundError, BadRequestError } = require("../helpers/expressError");


class Favorites {
   /** Find user's favorited recipes
    * 
    * Returns [{title, recipe_id}]
    */
   static async findAll(username) {

      const preCheck = await db.query(
         `SELECT username
          FROM users
          WHERE username = $1`, [username]);
      const user = preCheck.rows[0];

      if (!user) throw new NotFoundError(`No username: ${username}`);

      const result = await db.query(
         `SELECT favorites.recipe_id,
                 favorites.username,
                 r.title
         FROM favorites
         JOIN recipes AS r 
         ON favorites.recipe_id = r.id
         WHERE favorites.username = $1`,
         [username]
      );

      const favorites = result.rows;

      return favorites;
   }

   /** Save recipe to favorites
    * 
    * data should be {recipe_id, username}
    *  -- title is retreived useing the recipe_id
    * 
    * Returns { recipe_id, title, username}
    * 
    */
   static async save(username, recipeId) {

      const preCheck = await db.query(
         `SELECT id
         FROM recipes
         WHERE id = $1`, [recipeId]
      );
      const recipe = preCheck.rows[0];
      // console.log('inside save:', recipe)
      if (!recipe) throw new NotFoundError(`No recipe: ${recipeId}`)

      const preCheck2 = await db.query(
         `SELECT username
         FROM users
         WHERE username = $1`, [username]
      );
      const user = preCheck2.rows[0];
      if (!user) throw new NotFoundError(`No username: ${username}`);

      // const recipeRes = await Recipe.get(recipeId)
      // const title = recipeRes.title;
      // console.log(title)

      const preCheck3 = await db.query(
         `SELECT recipe_id, username
          FROM favorites
          WHERE recipe_id = $1 and username = $2`, [recipeId, username]
      )
      const favoriteRecipe = preCheck3.rows[0];
      if (favoriteRecipe) throw new BadRequestError(`You already favorited this recipe: ${recipeId}`)

      const result = await db.query(
         `INSERT INTO favorites (recipe_id, 
                                 username)
         VALUES ($1, $2)
         RETURNING recipe_id AS "recipeId", username`,
         [
            recipeId,
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
   static async remove(username, recipeId) {
      const result = await db.query(
         `DELETE 
         FROM favorites
         WHERE recipe_id = $1 and username = $2
         RETURNING recipe_id`,
         [recipeId, username]
      );
      const favorite = result.rows[0];

      if (!favorite) throw new NotFoundError(`No favorite recipe: ${recipeId}`)
   }
};

module.exports = Favorites;