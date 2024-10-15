const db= require('./db/connection')

exports.takeTheTopics= () =>{
    return db.query('SELECT * FROM topics;').then((result)=>{
        return result.rows;

    })
}
exports.takeTheSlug =(slugWord) =>{
    return db.query('SELECT * FROM topics WHERE slug= $1;',[slugWord]).then ((result) =>{
        return result.rows[0]
    })
}