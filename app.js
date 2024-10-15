const express= require('express')
const app= express()
const {getApi, getTopics,getArticles}= require('./controllers')

//Router setup
app.use(express.json())

app.get('/api',getApi);

app.get('/api/topics', getTopics);





app.get('*', (req,res) =>{
    res.status(404).send({msg:'Invalid point'})
})

  

module.exports= app;