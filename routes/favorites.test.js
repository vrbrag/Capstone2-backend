"use strict";

const request = require("supertest");

const db = require("../db.js");
const app = require("../app");
const User = require("../models/user");

const {
   commonBeforeAll,
   commonBeforeEach,
   commonAfterEach,
   commonAfterAll,
   favoriteIds,
   recipeIds,
   u1Token,
   u2Token,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /favorites/:username/:id */

describe("POST /favorites/:username/:id", function () {

   test("works for same user", async function () {
      const resp = await request(app)
         .post(`/favorites/u2/${recipeIds[0]}`)
         .set("authorization", `Bearer ${u2Token}`);
      expect(resp.body).toEqual({
         favorite: {
            recipeId: (recipeIds[0]),
            username: "u2",
         }
      });
   });

   test("unauth for others", async function () {
      const resp = await request(app)
         .post(`/favorites/u1/${recipeIds[0]}`)
         .set("authorization", `Bearer ${u2Token}`);
      expect(resp.statusCode).toEqual(401);
   });

   test("unauth for anon", async function () {
      const resp = await request(app)
         .post(`/favorites/u1/${recipeIds[1]}`);
      expect(resp.statusCode).toEqual(401);
   });

});

