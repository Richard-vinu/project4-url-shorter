const validUrl = require('valid-url')
const urlModel = require('../models/urlModel')
const shortID = require('shortid')


let baseUrl = 'http://localhost:3000'

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

    let findUrl = await urlModel.findOne({longUrl})

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
          return res.status(302).redirect(findUrl.longUrl)
      }
    }
    catch(err){
        return res.status(500).send({status : false, message : err.message})
    }
}



module.exports = {shortUrl, redirectToSource}







