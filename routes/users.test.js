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

/************************************** GET /users */

describe("GET /users", function () {
   test("Get list of users", async function () {
      const resp = await request(app)
         .get("/users")

      expect(resp.body).toEqual({
         users: [
            {
               username: "u1",
               firstName: "U1F",
               lastName: "U2L",
               email: "user1@user.com",
               age: 21,
               weight: 111,
               height: 61,
               gender: "female",
               pal: 1.4,
               goalWeight: "lose",
               dailyCal: 1688.21,
            },
            {
               username: "u2",
               firstName: "U1F",
               lastName: "U2L",
               email: "user2@user.com",
               age: 21,
               weight: 111,
               height: 61,
               gender: "male",
               pal: 1.4,
               goalWeight: "lose",
               dailyCal: 1920.61
            },
         ],
      });
   });
});


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
});

/************************************** GET /users/:username */

describe("GET /users/:username", function () {
   test("Get user info", async function () {
      const resp = await request(app)
         .get(`/users/u1`)

      expect(resp.body).toEqual({
         user: {
            username: "u1",
            firstName: "U1F",
            lastName: "U2L",
            email: "user1@user.com",
            age: 21,
            weight: 111,
            height: 61,
            gender: "female",
            pal: 1.4,
            goalWeight: "lose",
            dailyCal: 1688.21,
            recipes: [recipeIds[0]],
            favorites: [favoriteIds[0]],
            logs: []
         },
      });
   });

   test("not found if user not found", async function () {
      const resp = await request(app)
         .get(`/users/nope`)
      expect(resp.statusCode).toEqual(404);
   });
});

/************************************** PATCH /users/:username */

describe("PATCH /users/:username", () => {

   test("works for same user", async function () {
      const resp = await request(app)
         .patch(`/users/u1`)
         .send({
            firstName: "UpdateF",
         })
         .set("authorization", `Bearer ${u1Token}`);
      expect(resp.body).toEqual({
         user: {
            username: "u1",
            firstName: "UpdateF",
            lastName: "U2L",
            email: "user1@user.com",
            age: 21,
            weight: 111,
            height: 61,
            gender: "female",
            pal: 1.4,
            goalWeight: "lose",
            dailyCal: 1688.21,
         },
      });
   });

   test("unauth if not same user", async function () {
      const resp = await request(app)
         .patch(`/users/u1`)
         .send({
            firstName: "New",
         })
         .set("authorization", `Bearer ${u2Token}`);
      expect(resp.statusCode).toEqual(401);
   });

   test("unauth for anon", async function () {
      const resp = await request(app)
         .patch(`/users/u1`)
         .send({
            firstName: "New",
         });
      expect(resp.statusCode).toEqual(401);
   });

   test("works: can set new password", async function () {
      const resp = await request(app)
         .patch(`/users/u1`)
         .send({
            password: "new-password",
         })
         .set("authorization", `Bearer ${u1Token}`);
      expect(resp.body).toEqual({
         user: {
            username: "u1",
            firstName: "U1F",
            lastName: "U2L",
            email: "user1@user.com",
            age: 21,
            weight: 111,
            height: 61,
            gender: "female",
            pal: 1.4,
            goalWeight: "lose",
            dailyCal: 1688.21,
         },
      });
      const isSuccessful = await User.authenticate("u1", "new-password");
      expect(isSuccessful).toBeTruthy();
   });
});

/************************************** DELETE /users/:username */

describe("DELETE /users/:username", function () {

   test("works for same user", async function () {
      const resp = await request(app)
         .delete(`/users/u1`)
         .set("authorization", `Bearer ${u1Token}`);
      expect(resp.body).toEqual({ deleted: "u1" });
   });

   test("unauth if not same user", async function () {
      const resp = await request(app)
         .delete(`/users/u1`)
         .set("authorization", `Bearer ${u2Token}`);
      expect(resp.statusCode).toEqual(401);
   });

   test("unauth for anon", async function () {
      const resp = await request(app)
         .delete(`/users/u1`);
      expect(resp.statusCode).toEqual(401);
   });
});

/************************************** POST /users/:username/jobs/:id */

describe("GET /users/:username/favorites", function () {

   test("works for same user", async function () {
      const resp = await request(app)
         .get(`/users/u1/favorites`)
         .set("authorization", `Bearer ${u1Token}`);
      expect(resp.body).toEqual({
         favorites: [
            {
               recipe_id: (favoriteIds[0]),
               username: "u1",
               title: "Recipe2",
            },
         ]
      });
   });

   test("unauth for others", async function () {
      const resp = await request(app)
         .get(`/users/u1/favorites`)
         .set("authorization", `Bearer ${u2Token}`);
      expect(resp.statusCode).toEqual(401);
   });

   test("not found for no such username", async function () {
      const resp = await request(app)
         .get(`/users/nope/favorites`)
         .set("authorization", `Bearer ${u1Token}`);
      expect(resp.statusCode).toEqual(401);
   });

});
