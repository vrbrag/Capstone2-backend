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
   recipeIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /calLogs/log */

describe("POST /calLogs/log", function () {
   test("works for current user: log recipe", async function () {
      const resp = await request(app)
         .post("/calLogs/log")
         .send({
            username: "u1",
            recipeId: (recipeIds[0])
         })
         .set("authorization", `Bearer ${u1Token}`);
      expect(resp.statusCode).toEqual(200);
   });
});