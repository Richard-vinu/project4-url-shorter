const validUrl = require('valid-url')
const urlModel = require('../models/urlModel')
const shortID = require('shortid')
const { regexpToText } = require('nodemon/lib/utils')

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
         return res.status()
    }

    let createShortID = shortID.generate()
    

}
 catch(err){
      return res.status(500).send({status:"false",message:err.message})

  }
}



module.exports = {shortUrl}







