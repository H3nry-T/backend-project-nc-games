// const { request } = require("express");
const request = require("supertest");
const app = require("../app/app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  db.end();
});

describe("all tests", () => {
  describe("3-GET:/api/categories", () => {
    it("responds with a status code of 200", () => {
      return request(app).get("/api/categories").expect(200);
    });
    // it("responds with an error code of 400 if there is a bad request", () => {
    //   return request(app).get("/api/categories").expect(204);
    // });
    it("responds with category objects, must have slug, description properties", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then((response) => {
          const categories = response.body.categories;
          expect(categories).not.toHaveLength(0);
          categories.forEach((categoryObj) => {
            expect(categoryObj).toHaveProperty("slug");
            expect(categoryObj).toHaveProperty("description");
          });
        });
    });
  });
});
