const jwt = require('jsonwebtoken')
require('dotenv').config()


const protectRoute = async (req , res , next) => {

    try{
        let token = req.headers.token
        let decode = jwt.verify(token , process.env.SECRETKEY)
        console.log(decode)
        next()

    }catch(error){

        res.status(401).json({name : err.name ,
            message:err.message,
            url : req.originalUrl
            })       
    }

}


