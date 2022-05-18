const validUrl = require('valid-url')
const urlModel = require('../models/urlModel')
const shortID = require('shortid')
const redis = require("redis");

let baseUrl = 'https://localhost:3000'

//Connect to redis
const redisClient = redis.createClient(
    17250,
    "redis-17250.c264.ap-south-1-1.ec2.cloud.redislabs.com",
    { no_ready_check: true }
);
redisClient.auth("jZAOYkBGd1wFBP7h0Fdgk0J9LzFZFq5R", function (err) {
    if (err) throw err;
});

redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
});


const shortUrl = async (req,res)=>{

try{

    let data =req.body
    
    if(Object.keys(data).length==0){
        return res.status(400).send({status:false,message:"no input provided"})
    }
   
    const longUrl = req.body.longUrl
    if(!longUrl){
        return res.status(400).send({status:false, message:"please provide requires input feild"})
    }

    if(longUrl){ 
        let isUrl = validUrl.isUri(longUrl)
        if(!isUrl){
            return res.status(400).send({status:false, message:"not a valid url"})
        } 
    }

    let findUrl = await urlModel.findOne({longUrl })

    if(findUrl){
         return res.status(400).send({status : false, message : "this url already exists"})
    }

    let createShortID = shortID.generate()

    data['urlCode'] = createShortID

    let createUrl = baseUrl+"/"+ createShortID
    
    data['shortUrl'] = createUrl

    let createData = await urlModel.create(data)

    return res.status(201).send({status : true, data : createData})

}
 catch(err){
      return res.status(500).send({status:"false",message:err.message})

  }
}



const redirectToSource = async (req,res)=>{
    try{
      let url = req.params.urlCode
      
      let verifyUrl = shortID.isValid(url)

      if(!verifyUrl){
          return res.status(400).send({status : false, message : "This is not a valid URL CODE"})
      }
      
      let findUrl = await urlModel.findOne({urlCode : url})

      if(!findUrl){
          return res.status(400).send({status : false, message : "No url with this code"})
      }else{
          return res.status(307).redirect(findUrl.longUrl)
      }
    }
    catch(err){
        return res.status(500).send({status : false, message : err.message})
    }
}



module.exports = {shortUrl, redirectToSource}







