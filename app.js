const express = require("express");
const app = express();
const {
  getApi,
  getTopics,
  getArticleId,
  getAllArticles,
  getAllComments,
  sendAComment,
  updateAnArticle,
  getDeletedComment,
  getUsers
} = require("./controllers");
const cors = require("cors");

app.use(cors());

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleId);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getAllComments);

app.post("/api/articles/:article_id/comments", sendAComment);

app.patch("/api/articles/:article_id", updateAnArticle);

app.delete("/api/comments/:comment_id", getDeletedComment);

app.get("/api/users", getUsers);

app.get("*", (req, res) => {
  res.status(404).send({ msg: "Invalid point" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "Bad Request" });
  }
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  }
});

module.exports = app;
