const express= require('express')
const app= express()
const {getApi, getTopics, getArticleId, getAllArticles}= require('./controllers')


//Router setup
app.use(express.json())

app.get('/api',getApi);

app.get('/api/topics', getTopics);


app.get('/api/articles/:article_id', getArticleId)



app.get('/api/articles',getAllArticles)




app.get('*', (req,res) =>{
    res.status(404).send({msg:'Invalid point'})
})

  

module.exports= app;