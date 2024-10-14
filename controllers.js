const fs=require('fs').promises

exports.getApi= (req,res,next) =>{
    const endpointsPath= path.join(_dirname,'endpoints.json')
    fs.readFile(endpoints,'utf-8')
        .then(endpointsData =>{
            const endpoints=JSONS.parse(endpointsData)
            res.json(endpoints)
        })
        .catch((error) =>{
            next(error)
        })
}

//testing
exports.getTopics= (req,res,next) =>{
    const {description} = req.params;
    res.status(200).send(description);
}

exports.getArticles= (req,res,next) =>{
    
}