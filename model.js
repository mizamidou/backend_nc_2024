const db = require("./db/connection");

exports.takeTheTopics = () => {
  return db.query("SELECT * FROM topics;").then(result => {
    return result.rows;
  });
};

exports.takeTheArticleId = article_id => {
  return db
    .query(
      `SELECT articles.*, 
      (SELECT COUNT(*)::int FROM comments 
      WHERE comments.article_id = articles.article_id) AS comment_count 
      FROM articles 
      WHERE article_id=$1`,
      [article_id]
    )
    .then(result => {
      return result.rows;
    });
};

exports.takeTheArticles = topic => {
  const queryValuesTopic = [];
  let queryStr = `   
        SELECT 
            articles.author,
            articles.title,
            articles.article_id,
            articles.topic,
            articles.created_at,
            articles.votes,
            articles.article_img_url,
            COUNT(comments.comment_id) AS comment_count
            FROM articles
            LEFT JOIN comments ON articles.article_id= comments.article_id
            `;
  if (topic) {
    queryValuesTopic.push(topic);
    queryStr += ` WHERE topic = $1`;
  }
  queryStr += `  
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC`;
  return db.query(queryStr, queryValuesTopic).then(result => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "No articles found" });
    }
    return result.rows;
  });
};

exports.takeAllComments = article_id => {
  return db
    .query(
      ` SELECT 
            comments.body,
            comments.votes,
            comments.author,
            comments.created_at,
            comments.comment_id,
            comments.article_id
        FROM comments
        WHERE comments.article_id= $1
        ORDER BY comments.created_at DESC;`,
      [article_id]
    )
    .then(result => {
      return result.rows;
    })
    .catch(error => {
      console.log(error);
    });
};

exports.addAComment = (article_id, author, body) => {
  return db
    .query(
      `
        INSERT INTO comments (article_id, author, body)
        VALUES ($1, $2, $3)
        RETURNING *;
        `,
      [article_id, author, body]
    )
    .then(result => {
      return result.rows[0];
    });
};

exports.addAVote = (article_id, inc_votes) => {
  return db
    .query(
      `
        UPDATE articles 
        SET votes= votes + $2
        WHERE article_id= $1
        RETURNING *;
        `,
      [article_id, inc_votes]
    )
    .then(result => {
      return result.rows[0];
    });
};

exports.getOneComment = comment_id => {
  return db
    .query(
      `
        DELETE FROM comments
        WHERE comment_id=$1
        RETURNING *;`,
      [comment_id]
    )
    .then(result => {
      return result.rows[0];
    });
};

exports.getAUser = () => {
  return db
    .query(`SELECT username, name, avatar_url FROM users;`)
    .then(result => {
      return result.rows;
    });
};
