const express= require('express')
const app= express()
const {getApi, getTopics,getArticles}= require('./controllers')

app.use(express.json())

app.get('api/',getApi);

app.get('api/topics', getTopics);

app.get('/api/articles',getArticles);


app.use((err,req,res,next)=>{
    if (err.status && err.msg){
      res.status(err.status).send({msg:err.msg});
    }
  })

module.exports= app;