const fs=require('fs').promises
const {takeTheTopics}= require('./model')
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



