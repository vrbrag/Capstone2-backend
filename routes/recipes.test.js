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
   testJobIds,
   u1Token,
   u2Token,
   adminToken,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /recipes/add */

describe("POST /recipes/add", function () {
   test("works for logged in users", async function () {
      const resp = await request(app)
         .post("/recipes/add")
         .send({
            title: "NewRecipe",
            cuisine: "NewCuisine",
            ingredients: "NewIngredients, Rice",
            instructions: "Bake at 450F",
            avgCal: 1000,
            notes: "Do not over stir",
            username: "u1"
         })
         .set("authorization", `Bearer ${u1Token}`);
      expect(resp.statusCode).toEqual(201);
      expect(resp.body).toEqual({
         recipe: {
            id: (expect.any(Number)),
            title: "NewRecipe",
            cuisine: "NewCuisine",
            ingredients: ["NewIngredients", "Rice"],
            instructions: "Bake at 450F",
            avgCal: 1000,
            notes: "Do not over stir",
            username: "u1"
         }
      })
   })

   test("unauth for anon", async function () {
      const resp = await request(app)
         .post("/recipes/add")
         .send({
            title: "NewNewRecipe",
            cuisine: "NewCuisine",
            ingredients: "NewIngredients, Rice",
            instructions: "Bake at 450F",
            avgCal: 1000,
            notes: "Do not over stir",
            username: "u1"
         });
      expect(resp.statusCode).toEqual(401);
   });

   test("bad request if missing data", async function () {
      const resp = await request(app)
         .post("/recipes/add")
         .send({
            username: "u-new",
         })
         .set("authorization", `Bearer ${u1Token}`);
      expect(resp.statusCode).toEqual(400);
   });
})