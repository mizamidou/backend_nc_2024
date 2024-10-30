const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const endpoints = require("../endpoints.json");
const comments = require("../db/data/test-data/comments");
const jest_sorted = require("jest-sorted");
const Test = require("supertest/lib/test");
const users = require("../db/data/test-data/users");

beforeEach(() => {
  return seed(testData);
});
afterAll(() => db.end());

describe("api/topics", () => {
  test("GET:array of objects topics with slug and description property", () => {
    return request(app).get("/api/topics").expect(200).then(response => {
      expect(Array.isArray(response.body.topics)).toBe(true);
      expect(response.body.topics.length).toBe(3);
      response.body.topics.forEach(topic => {
        expect(typeof topic.slug).toBe("string");
        expect(typeof topic.description).toBe("string");
      });
    });
  });
  test("GET:non existing route returns 404", () => {
    return request(app)
      .get("/api/topics/notARoute")
      .expect(404)
      .then(response => {
        expect(response.body.msg).toBe("Invalid point");
      });
  });
});

describe("GET: API endpoints", () => {
  test("GET:object of endpoints with description,queries, exampleResponse, articles", () => {
    return request(app).get("/api").expect(200).then(response => {
      expect(response.body).toHaveProperty("endpoints");
      expect(response.body.endpoints).toEqual(endpoints);
    });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("GET:an array of objects with properties author, title, article_id, body", () => {
    return request(app).get("/api/articles/1").expect(200).then(response => {
      const article = response.body.article;
      expect(typeof article.author).toBe("string");
      expect(typeof article.title).toBe("string");
      expect(typeof article.article_id).toBe("number");
      expect(typeof article.body).toBe("string");
      expect(typeof article.topic).toBe("string");
      expect(typeof article.created_at).toBe("string");
      expect(typeof article.votes).toBe("number");
      expect(typeof article.article_img_url).toBe("string");
    });
  });

  test("GET:404 if article_id is not valid number", () => {
    return request(app)
      .get("/api/articles/invalidNumber")
      .expect(400)
      .then(response => {
        expect(response.body.msg).toBe("Invalid point");
      });
  });
});

describe("GET /api/articles", () => {
  test("GET:AN OBJECT common_count, total count of all comments in each article_id ", () => {
    return request(app).get("/api/articles").expect(200).then(response => {
      expect(Array.isArray(response.body.articles)).toBe(true);
      response.body.articles.forEach(article => {
        expect(typeof article.comment_count).toBe("string");
      });
    });
  });
  test("GET:return articles without the body", () => {
    return request(app).get("/api/articles").expect(200).then(response => {
      response.body.articles.forEach(article => {
        expect(article).not.toHaveProperty("body");
      });
    });
  });
  test("GET:return articles sorted by date in descending order", () => {
    return request(app).get("/api/articles").expect(200).then(response => {
      expect(response.body.articles).toBeSortedBy("created_at", {
        descending: true
      });
    });
  });
});

describe(" GET /api/articles/:article_id/comments", () => {
  test("GET all comments from an article with properties votes,author,body", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(response => {
        const comments = response.body.comments;
        expect(Array.isArray(comments)).toBe(true);
        comments.forEach(comment => {
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
        });
      });
  });
  test("GET all comments from a most recent one", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(response => {
        const comments = response.body.comments;
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET no comments for an article", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(response => {
        const comments = response.body.comments;
        expect(comments.length).toBe(0);
      });
  });
});

describe("POST:/api/articles/:article_id/comments", () => {
  test("POST:posted comment with username and body property", () => {
    const newComm = {
      author: "icellusedkars",
      body: " I carry a log — yes. Is it funny to you? It is not to me."
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComm)
      .expect(201)
      .then(response => {
        const comments = response.body.comments;
        expect(comments.author).toBe("icellusedkars");
        expect(comments.body).toBe(
          " I carry a log — yes. Is it funny to you? It is not to me."
        );
      });
  });
  test("POST:posted comment with not writing username ", () => {
    const newComm = {
      author: " ",
      body: "I carry a log — yes. Is it funny to you? It is not to me."
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComm)
      .expect(400)
      .then(response => {
        expect(response.body.msg).toBe("Bad Request:username is missing");
      });
  });
  test("POST:posted comment wihtout a body ", () => {
    const newComm = { author: "icellusedkars ", body: " " };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComm)
      .expect(400)
      .then(response => {
        expect(response.body.msg).toBe("Bad Request:comment is missing");
      });
  });
});

describe("PATCH: /api/articles/:article_id", () => {
  test("200:update am article with an object {inv_votes:1} based on newVotes", () => {
    const newVote = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(200)
      .then(response => {
        expect(response.body.votes).toBe(101);
      });
  });
  test("200:update am article with an object {inv_votes:-100} based on newVotes", () => {
    const newVote = { inc_votes: -100 };
    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(200)
      .then(response => {
        expect(response.body.votes).toBe(0);
      });
  });

  test("400:there is no vote", () => {
    const newVote = {};
    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(400)
      .then(response => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  //PATCH:400 article_id=notValid
  //PATCH:404 article_id=notFound
});

describe("DELETE: /api/comments/:comment_id", () => {
  test("DELETE:delete a given comment", () => {
    return request(app).delete("/api/comments/1").expect(204).then(response => {
      expect(response.body).toEqual({});
    });
  });
  test("DELETE: a rescourse that doesnt exist", () => {
    return request(app)
      .delete("/api/comments/999999")
      .expect(404)
      .then(response => {
        expect(response.body.msg).toBe("The comment doesnt exist");
      });
  });
  test("DELETE: invalid comment_id", () => {
    return request(app)
      .delete("/api/comments/isNotValid")
      .expect(400)
      .then(response => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
});

describe("GET:/api/users", () => {
  test("200:get all users with username,name,avatar_url properties", () => {
    return request(app).get("/api/users").expect(200).then(response => {
      const users = response.body.users;
      expect(Array.isArray(users)).toBe(true);
      users.forEach(user => {
        expect(typeof user.username).toBe("string");
        expect(typeof user.name).toBe("string");
        expect(typeof user.avatar_url).toBe("string");
      });
    });
  });
});

describe(" GET /api/articles(sorting)", () => {
  test("200:sorted_by created_at in descending correctly", () => {
    return request(app).get("/api/articles").expect(200).then(response => {
      const articles = response.body.articles;
      expect(articles).toBeSortedBy("created_at", { descending: true });
    });
  });
});

describe("GET /api/articles (topic query)", () => {
  test("200:filtering articles by topic", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(response => {
        expect(response.body.articles.length).toBe(1);
        response.body.articles.forEach(article => {
          expect(article.topic).toBe("cats");
        });
      });
  });
  test("404:return error when no articles found", () => {
    return request(app)
      .get("/api/articles?topic=NotExistedTopic")
      .expect(404)
      .then(response => {
        expect(response.body.msg).toBe("No articles found");
      });
  });
});

describe("GET /api/articles/:article_id (comment_count)", () => {
  test("200:comment_count feature adding correctly", () => {
    return request(app).get("/api/articles/1").expect(200).then(response => {
      expect(response.body.article.comment_count).toBe(11);
    });
  });
});
