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

/************************************** POST /auth/register */

describe("POST /auth", function () {
   test("Register new user", async function () {
      const resp = await request(app)
         .post("/auth/register")
         .send({
            username: "u-new",
            password: "password-new",
            firstName: "First-new",
            lastName: "Last-new",
            email: "new@user.com",
            age: 21,
            weight: 111,
            height: 61,
            gender: "female",
            pal: 1.4,
            goalWeight: "lose",
         })

      expect(resp.statusCode).toEqual(201);
      expect(resp.body).toEqual({
         token: expect.any(String),
      });
   });

   test("bad request with missing fields", async function () {
      const resp = await request(app)
         .post("/auth/register")
         .send({
            username: "new",
         });
      expect(resp.statusCode).toEqual(400);
   });

   test("bad request with invalid data", async function () {
      const resp = await request(app)
         .post("/auth/register")
         .send({
            username: "u-new",
            password: "password-new",
            firstName: "First-new",
            lastName: "Last-new",
            email: "not-an-email",
            age: 21,
            weight: 111,
            height: 61,
            gender: "female",
            pal: 1.4,
            goalWeight: "lose",
         });
      expect(resp.statusCode).toEqual(400);
   });
});

/************************************** POST /auth/token */

describe("POST /auth/token", function () {
   test("works: username, password", async function () {
      const resp = await request(app)
         .post("/auth/token")
         .send({
            username: "u1",
            password: "password1",
         });
      expect(resp.body).toEqual({
         "token": expect.any(String),
      });
   });

   test("unauth with non-existent user", async function () {
      const resp = await request(app)
         .post("/auth/token")
         .send({
            username: "no-such-user",
            password: "password1",
         });
      expect(resp.statusCode).toEqual(401);
   });

   test("unauth with wrong password", async function () {
      const resp = await request(app)
         .post("/auth/token")
         .send({
            username: "u1",
            password: "nope",
         });
      expect(resp.statusCode).toEqual(401);
   });

   test("bad request with missing data", async function () {
      const resp = await request(app)
         .post("/auth/token")
         .send({
            username: "u1",
         });
      expect(resp.statusCode).toEqual(400);
   });

   test("bad request with invalid data", async function () {
      const resp = await request(app)
         .post("/auth/token")
         .send({
            username: 42,
            password: "above-is-a-number",
         });
      expect(resp.statusCode).toEqual(400);
   });
});