const db= require('./db/connection')

exports.takeTheTopics= () =>{
    return db.query('SELECT * FROM topics;').then((result)=>{
        return result.rows;

    })
}

exports.takeTheArticleId= (article_id) =>{
    return db.query('SELECT * FROM articles WHERE article_id=$1',[article_id]).then((result) =>{
        return result.rows;
    })
}


exports.takeTheArticles= ()=>{
    return db
    .query(`   
        SELECT 
            articles.author,
            articles.title,
            articles.article_id,
            articles.topic,
            articles.created_at,
            articles.votes,
            articles.article_img_url, 
            COUNT(comments.article_id) AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id= comments.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC;`)
    .then((result) =>{
        return result.rows;
    })
}

