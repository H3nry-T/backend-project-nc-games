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

describe("RUN ALL TESTS", () => {
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

  describe("5-GET:/api/reviews/:review_id", () => {
    it("responds with a status code of 200", () => {
      return request(app).get("/api/reviews/1").expect(200);
    });
    it("responds with an error code of 404-Not found if the review_id does not exist", () => {
      return request(app)
        .get("/api/reviews/100000")
        .expect(404)
        .then(({ body }) => {
          expect(body.error).toEqual({ code: 404, msg: "Not found" });
        });
    });
    it("responds with an error code of 400-Bad request if the review_id is not an id", () => {
      return request(app).get("/api/reviews/NotAnId").expect(400);
    });
    it(`responds with 1 review object with these properties:
            review_id
            title
            review_body
            designer
            review_img_url
            votes
            category
            owner
            created_at
    `, () => {
      return request(app)
        .get("/api/reviews/1")
        .expect(200)
        .then((response) => {
          const review = response.body.review;
          expect(typeof review).toBe("object");
          expect(Array.isArray(review)).toBe(false);
          expect(review).toHaveProperty("review_id");
          expect(review).toHaveProperty("title");
          expect(review).toHaveProperty("review_body");
          expect(review).toHaveProperty("designer");
          expect(review).toHaveProperty("review_img_url");
          expect(review).toHaveProperty("votes");
          expect(review).toHaveProperty("category");
          expect(review).toHaveProperty("owner");
          expect(review).toHaveProperty("created_at");
        });
    });
  });

  describe("6-GET:/api/reviews/:review_id/comments", () => {
    it("responds with a status code of 200", () => {
      return request(app).get("/api/reviews/1/comments").expect(200);
    });
    it("responds with an error code of 404-Not found if the review_id is a massive number", () => {
      return request(app)
        .get("/api/reviews/100000/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.error).toEqual({ code: 404, msg: "Not found" });
        });
    });
    it("responds with an error code of 400-Bad request if the review_id is not an id", () => {
      return request(app)
        .get("/api/reviews/NotAnId/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.error).toEqual({ code: 400, msg: "Bad request" });
        });
    });
    it("responds with an empty comments array when valid review has no comments", () => {
      return request(app)
        .get("/api/reviews/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toEqual([]);
        });
    });
    it(`responds with array of comments with these properties:
              comment_id
              votes
              created_at
              author
              body
              review_id
      `, () => {
      return request(app)
        .get("/api/reviews/2/comments")
        .expect(200)
        .then((response) => {
          const comments = response.body.comments;
          expect(Array.isArray(comments)).toBe(true);
          comments.forEach((commentObj) => {
            expect(commentObj).toHaveProperty("comment_id");
            expect(commentObj).toHaveProperty("votes");
            expect(commentObj).toHaveProperty("created_at");
            expect(commentObj).toHaveProperty("author");
            expect(commentObj).toHaveProperty("body");
            expect(commentObj).toHaveProperty("review_id");
          });
        });
    });
    it(`serves comments in descending order with most recent comments at the top
      `, () => {
      return request(app)
        .get("/api/reviews/2/comments")
        .expect(200)
        .then((response) => {
          const comments = response.body.comments;
          expect(Array.isArray(comments)).toBe(true);
          expect(comments[0].comment_id).toBe(5);
          expect(comments[1].comment_id).toBe(1);
          expect(comments[comments.length - 1].comment_id).toBe(4);
        });
    });
  });

  describe("7-POST/api/reviews/:review_id/comments", () => {
    it("should accept valid username, and body and respond 201 status", () => {
      return request(app)
        .post("/api/reviews/1/comments")
        .send({
          username: "mallionaire",
          body: "Epic game!",
        })
        .expect(201);
    });
    it("should NOT accept unregistered username, respond 400 status", () => {
      return request(app)
        .post("/api/reviews/1/comments")
        .send({
          username: "pacman117",
          body: "this is my favourite game, truly one of the goats",
        })
        .expect(400)
        .then((response) => {
          const error = response.body.error;
          expect(error).toEqual({
            code: 400,
            msg: "Bad request the username is not registered with us",
          });
        });
    });
    it("should respond 400 status when the request has missing key", () => {
      return request(app)
        .post("/api/reviews/1/comments")
        .send({
          username: "mallionare",
        })
        .expect(400)
        .then((response) => {
          const error = response.body.error;
          expect(error).toEqual({
            code: 400,
            msg: "Bad request must have username, body keys",
          });
        });
    });
    it("should respond 400 status when the request has 2 keys but incorrect key names", () => {
      return request(app)
        .post("/api/reviews/1/comments")
        .send({
          notUsername: "mallionare",
          notAComment: "notAComment",
        })
        .expect(400)
        .then((response) => {
          const error = response.body.error;
          expect(error).toEqual({
            code: 400,
            msg: "Bad request must have username, body keys",
          });
        });
    });
    it("should respond with postedComment", () => {
      return request(app)
        .post("/api/reviews/1/comments")
        .send({
          username: "mallionaire",
          body: "this is my favourite game, truly one of the goats",
        })
        .expect(201)
        .then((response) => {
          const postedComment = response.body.postedComment;

          expect(postedComment).toHaveProperty("comment_id");
          expect(postedComment).toHaveProperty(
            "body",
            "this is my favourite game, truly one of the goats"
          );
          expect(postedComment).toHaveProperty("review_id", 1);
          expect(postedComment).toHaveProperty("author", "mallionaire");
          expect(postedComment).toHaveProperty("votes", 0);
          expect(postedComment).toHaveProperty("created_at");
        });
    });
  });

  describe("8-PATCH /api/reviews/:review_id", () => {
    it("accepts valid patch request and responds with 200 status code", () => {
      return request(app)
        .patch("/api/reviews/1")
        .send({
          incVotes: 2,
        })
        .expect(200);
    });
    it("decline an invalid patch request with a incorrectly named key and respond with 400", () => {
      return request(app)
        .patch("/api/reviews/1")
        .send({
          randomKey: 400,
        })
        .expect(400)
        .then((response) => {
          const error = response.body.error;
          expect(error).toEqual({ code: 400, msg: "missing an incVotes key" });
        });
    });
    it("decline patch request with too many keys responds 400", () => {
      return request(app)
        .patch("/api/reviews/9")
        .send({
          randomKey: 400,
          anotherKey: 600,
        })
        .expect(400)
        .then((response) => {
          const error = response.body.error;
          expect(error).toEqual({ code: 400, msg: "missing an incVotes key" });
        });
    });
    it("decline patch request with no keys responds 400", () => {
      return request(app)
        .patch("/api/reviews/8")
        .send({})
        .expect(400)
        .then((response) => {
          const error = response.body.error;
          expect(error).toEqual({ code: 400, msg: "missing an incVotes key" });
        });
    });
    it("decline patch request for invalid ids", () => {
      return request(app)
        .patch("/api/reviews/10000")
        .send({
          incVotes: 2,
        })
        .expect(404)
        .then((response) => {
          const error = response.body.error;
          expect(error).toEqual({ code: 404, msg: "Not found" });
        });
    });
    it("should accept a valid patch request and respond with 200 satus code", () => {
      return request(app)
        .patch("/api/reviews/1")
        .send({
          incVotes: 2,
        })
        .expect(200)
        .then((response) => {
          const patchedReview = response.body.patchedReview;
          expect(patchedReview).toHaveProperty("votes", 3); //review_id 1 has 1 vote increment by 2 votes to get 3 votes
        });
    });
    it("should be able to decrement votes for valid patch request and respond with 200 satus code", () => {
      return request(app)
        .patch("/api/reviews/6") //has 8 votes
        .send({
          incVotes: -1,
        })
        .expect(200)
        .then((response) => {
          const patchedReview = response.body.patchedReview;
          expect(patchedReview).toHaveProperty("votes", 7); //8 - 1 = 7 votes
        });
    });
  });

  describe("9-GET/api/users", () => {
    it("should respond with 200 status code", () => {
      return request(app).get("/api/users").expect(200);
    });
    it("should respond with 404 status code if endpoint is misstyped", () => {
      return request(app).get("/api/usrs").expect(404);
    });
    it(`
          should return array of object with each object having the following properties:
          username
          name
          avatar_url
  `, () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((response) => {
          const users = response.body.users;
          users.forEach((userObj) => {
            expect(userObj).toHaveProperty("username");
            expect(userObj).toHaveProperty("name");
            expect(userObj).toHaveProperty("avatar_url");
          });
        });
    });
  });

  describe("10-GET/api/reviews?queries REFACTORS 4-GET:/api/reviews", () => {
    it("GET/api/reviews accepts query: category=(category)", () => {
      return request(app)
        .get("/api/reviews")
        .query({ category: "euro game" })
        .expect(200)
        .then((response) => {
          const reviews = response.body.reviews;
          reviews.forEach((reviewObj) => {
            expect(reviewObj).toHaveProperty("category", "euro game");
          });
        });
    });
    it("GET/api/reviews declines query: category=(notAcategory) 400", () => {
      return request(app)
        .get("/api/reviews")
        .query({ category: "notAcategory" })
        .expect(400)
        .then((response) => {
          const error = response.body.error;
          expect(error).toEqual({ code: 400, msg: "invalid category query" });
        });
    });
    it("GET/api/reviews accepts query: sort_by=allValidColumns", () => {
      const columnName = "owner";
      return request(app)
        .get("/api/reviews")
        .query({ sort_by: columnName })
        .expect(200)
        .then((response) => {
          const reviews = response.body.reviews;
          expect(reviews[0]).toHaveProperty(columnName, "bainesface");
          expect(reviews[reviews.length - 1]).toHaveProperty(
            columnName,
            "philippaclaire9"
          );
        });
    });
    it("GET/api/reviews declines query: sort_by=notAcolumn 400", () => {
      return request(app)
        .get("/api/reviews")
        .query({ sort_by: "notAcolumn" })
        .expect(400)
        .then((response) => {
          const error = response.body.error;
          expect(error).toEqual({ code: 400, msg: "invalid sort_by query" });
        });
    });
    it("GET/api/reviews accepts query: order=DESC", () => {
      return request(app)
        .get("/api/reviews")
        .query({ order: "DESC" })
        .expect(200)
        .then((response) => {
          const reviews = response.body.reviews;
          expect(reviews[0]).toHaveProperty(
            "title",
            "Mollit elit qui incididunt veniam occaecat cupidatat"
          );
          expect(reviews[reviews.length - 1]).toHaveProperty(
            "title",
            "Settlers of Catan: Don't Settle For Less"
          );
        });
    });
    it("GET/api/reviews declines query: order=DESSSC 400", () => {
      return request(app)
        .get("/api/reviews")
        .query({ order: "DESSSC" })
        .expect(400)
        .then((response) => {
          const error = response.body.error;
          expect(error).toEqual({ code: 400, msg: "invalid order query" });
        });
    });
    it("GET/api/reviews accepts MULTIPLE queries: category=children's games:sort_by=designer:order=DESC", () => {
      return request(app)
        .get("/api/reviews")
        .query({
          category: "social deduction",
          sort_by: "designer",
          order: "DESC",
        })
        .expect(200)
        .then((response) => {
          const reviews = response.body.reviews;
          expect(reviews[0]).toHaveProperty("designer", "Wolfgang Warsch");
          expect(reviews[reviews.length - 1]).toHaveProperty(
            "designer",
            "Akihisa Okui"
          );
          reviews.forEach((reviewObj) => {
            expect(reviewObj).toHaveProperty("category", "social deduction");
          });
        });
    });
  });

  describe("11-GET/api/reviews/:review_id (comment count) REFACTORS 5-GET:/api/reviews/:review_id", () => {
    it(`responds with review object with comment_count added`, () => {
      return request(app)
        .get("/api/reviews/1")
        .expect(200)
        .then((response) => {
          const review = response.body.review;
          expect(typeof review).toBe("object");
          expect(Array.isArray(review)).toBe(false);
          expect(review).toHaveProperty("comment_count");
        });
    });
  });

  describe("12-DELETE/api/comments/:comment_id", () => {
    it("should delete the comment from the database responds with 204", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then(() => {
          return db.query("SELECT * FROM comments").then((result) => {
            const comments = result.rows;
            expect(comments).not.toHaveLength(0);
            comments.forEach((commentObj) => {
              expect(commentObj).not.toHaveProperty("comment_id", 1);
            });
          });
        });
    });
    it("should respond 404 if the comment_id is too high or invalid", () => {
      return request(app)
        .delete("/api/comments/100000")
        .expect(404)
        .then((response) => {
          const error = response.body.error;
          expect(error).toEqual({ code: 404, msg: "Invalid comment_id" });
        });
    });
    it("should respond 400 if notAnid is passed as a parameter", () => {
      return request(app)
        .delete("/api/comments/notAnId")
        .expect(400)
        .then((response) => {
          const error = response.body.error;
          expect(error).toEqual({ code: 400, msg: "Bad request" });
        });
    });
  });

  describe("13-GET: /api", () => {
    it("should return a json object with all the endpoints listed", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((response) => {
          const allEndpoints = response.body.allEndpoints;
          expect(allEndpoints).toHaveProperty("GET /api");
          expect(allEndpoints).toHaveProperty("GET /api/categories");
          expect(allEndpoints).toHaveProperty("GET /api/reviews");
          expect(allEndpoints).toHaveProperty("GET /api/reviews/:review_id");
          expect(allEndpoints).toHaveProperty(
            "GET /api/reviews/:review_id/comments"
          );
          expect(allEndpoints).toHaveProperty(
            "POST /api/reviews/:review_id/comments"
          );
          expect(allEndpoints).toHaveProperty("PATCH /api/reviews/:review_id");
          expect(allEndpoints).toHaveProperty("GET /api/users");
          expect(allEndpoints).toHaveProperty(
            "DELETE /api/comments/comment_id"
          );
          for (const key in allEndpoints) {
            expect(allEndpoints[key]).toHaveProperty("description");
          }
        });
    });
  });
});
