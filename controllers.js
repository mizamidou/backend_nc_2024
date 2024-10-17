const fs=require('fs').promises
const {takeTheTopics,takeTheArticleId,takeTheArticles,takeAllComments, addAComment}= require('./model')

const path=require('path')

exports.getApi= (req,res,next) =>{
    const endPointsPath= path.join(__dirname,'endpoints.json')
    return fs.readFile(endPointsPath,'utf-8')
        .then(endPointsData =>{
            const endpoints=JSON.parse(endPointsData)
            res.json({endpoints})
        })
        .catch((error) =>{
            next(error)
        })
}


exports.getTopics= (req,res,next) =>{
    takeTheTopics()
    .then((topics) =>{
        res.status(200).send({topics})
    })
    .catch((error) =>{
        next(error)
    })
}


exports.getArticleId= (req,res,next) =>{
    const {article_id}= req.params
    if(!article_id || isNaN(article_id)){
        res.status(400).send({msg:'Invalid point'})}
    takeTheArticleId(article_id)
    .then((articleArray) =>{
        const article= articleArray[0]
        res.status(200).send({article})
    })
    .catch((error) =>{
        next(error)
    })
}

exports.getAllArticles= (req,res,next) =>{
    takeTheArticles()
    .then((articles) =>{
        res.status(200).send({articles})
    })
    .catch((error) =>{
        next(error)
    })
}
exports.getAllComments= (req,res,next)=>{
    const {article_id}= req.params;
    takeAllComments(article_id)
    .then((comments) =>{
        res.status(200).send({comments})
    })
    .catch(next)
}

exports.sendAComment= (req,res,next) =>{
    const {article_id} = req.params;
    const {author,body}= req.body;

    if (body===' '){
        return res.status(400).send({msg:'Bad Request:comment is missing'})
    }
    if (author===' '){
        return res.status(400).send({msg:'Bad Request:username is missing'})
    }
    addAComment(article_id, author, body)
    .then((comments) =>{
        res.status(201).send({comments})
    })
    .catch((error) =>{
        if(error.status){
            res.status(error.status).send({msg:'error message'})
        }else{
            next(error)
        }
    })
}

