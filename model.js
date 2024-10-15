const db= require('./db/connection')

exports.takeTheTopics= () =>{
    return db.query('SELECT * FROM topics;').then((result)=>{
        return result.rows;

    })
}
