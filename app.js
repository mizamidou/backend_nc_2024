const express= require('express')
const app= express()
const {getApi, getTopics,getArticles, getDescriptionSlug}= require('./controllers')

//Router setup
app.use(express.json())

app.get('/api/',getApi);

app.get('/api/topics', getTopics);

app.get('/api/articles',getArticles);




//Error handling

app.use('/api/topics/notARoute',(req,res)=>{
    res.status(404).send({msg:'The request root doesnt exist'})
   
})
app.get('/api/topics/:slug',getDescriptionSlug)
 
app.use((err, req, res, next) => {
    console.log(err)
    if (err.status && err.msg) {
      res.status(err.status).send({ msg: err.msg });
    } else {
      console.log(err);
      res.status(500).send({ msg: "Internal Server Error" });
    }
    
  })

  

module.exports= app;