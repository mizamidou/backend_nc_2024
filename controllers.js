const fs=require('fs').promises
const {takeTheTopics, takeTheSlug}= require('./model')

exports.getApi= (req,res,next) =>{
    const endPointsPath= path.join(__dirname,'endpoints.json')
    return fs.readFile(endPointsPath,'utf-8')
        .then(endPointsData =>{
            const endpoints=JSON.parse(endPointsData)
            res.json(endpoints)
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
exports.getArticles= (req,res,next) =>{

}



exports.getDescriptionSlug= (req,res) =>{
    const slugWord= req.params.slug
    takeTheSlug(slugWord)
    .then ((topic) =>{
        if(topic){
        res.status(200).send({topic})
    }else {
        res.status(404).send({msg:'Invalid point'})
    }
    })
    .catch((error) =>{
        next(error)
    })
}