const express= require('express')
const app= express()
const {getApi, getTopics, getArticleId, getAllArticles, getAllComments,sendAComment,updateAnArticle}= require('./controllers')




//Router setup
app.use(express.json())

app.get('/api',getApi);

app.get('/api/topics', getTopics);


app.get('/api/articles/:article_id', getArticleId)



app.get('/api/articles',getAllArticles)

app.get('/api/articles/:article_id/comments',getAllComments)

app.post('/api/articles/:article_id/comments', sendAComment)

app.patch('/api/articles/:article_id',updateAnArticle)


app.get('*', (req,res) =>{
    res.status(404).send({msg:'Invalid point'})
})

  

module.exports= app;