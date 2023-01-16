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
    it("responds with an error code of 404 if endpoint is misstyped", () => {
      return request(app).get("/api/categoryies").expect(404);
    });
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

  describe("4-GET:/api/reviews", () => {
    it("responds with a status code of 200", () => {
      return request(app).get("/api/categories").expect(200);
    });
    it("responds with an error code of 404 if endpoint is misstyped", () => {
      return request(app).get("/api/categoryies").expect(404);
    });
    it(`responds with an array of review objects, 
        they must have the following properties: 
        owner
        title
        review_id
        category
        review_img_url
        created_at
        votes
        designer
        comment_count`, () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then((response) => {
          const reviews = response.body.reviews;
          expect(reviews).not.toHaveLength(0);
          reviews.forEach((reviewObj) => {
            expect(reviewObj).toHaveProperty("owner");
            expect(reviewObj).toHaveProperty("title");
            expect(reviewObj).toHaveProperty("review_id");
            expect(reviewObj).toHaveProperty("category");
            expect(reviewObj).toHaveProperty("review_img_url");
            expect(reviewObj).toHaveProperty("created_at");
            expect(reviewObj).toHaveProperty("votes");
            expect(reviewObj).toHaveProperty("designer");
            expect(reviewObj).toHaveProperty("comment_count");
          });
        });
    });
  });
});
