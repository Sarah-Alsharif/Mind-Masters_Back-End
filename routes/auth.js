const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken")
const protectRoute = require('../helper/protectRoute')
const Quizes = require('../models/Quizes.model')


// login Route 
router.post('/login' , async (req , res) => {

    const {email , password} = req.body
    
    try{

        let user = await User.findOne({email: email})
        if(!user) throw new Error("Account is not registerd")
        if(!bcrypt.compareSync(password , user.password)) throw new Error('Email or password is not correct')
        // delete password from the object returned to front end
        user.password = undefined
        
        let token = jwt.sign({user} ,
            process.env.SECRETKEY , {
            expiresIn: 60*60*1000
            })
        res.json({message: "You are successfully logged in" , token})    


    }catch(error){

        res.status(401).json({
            name: error.name , 
            message: error.message , 
            url: req.originalUrl
        })
    }


})

// register Route 
router.post('/register' , async (req , res) => {
   
    try{

        const newUser = await new User(req.body);
        console.log(newUser)

        const user = await User.findOne({email: newUser.email})

        if(user) throw new Error('Email is already registerd!')

        await newUser.save();
        res.json({
            message: "Account Created Successfully",
            user: newUser,
            success: true
        })

    }catch(error){

        res.status(401).json({
            name: error.name , 
            message: error.message , 
            url: req.originalUrl
        })
    }

})


// change password Route
router.put('/changePassword' , (req , res) => {

    const password = req.body.password 
    const user_id = req.body.id
    
    try{
        let user= await User.findOne({_id: user_id})
        user.password= password
        user.save()
        res.json({message: "You are successfully Update Password"}) 
        console.log("Password update done")
        }catch(error){
        res.status(401).json({
        name: error.name , 
        message: error.message , 
        url: req.originalUrl
        })
    }

})

// show profile Route
router.get('/profile' , (req , res) => {

})

// upload img
router.post('/uploadImg' , async (req , res) => {
      
    const user_id = req.body.userId;
    const imgUrl = req.body.profileImg;
    console.log(imgUrl)

    const newData = {
        profileImg: imgUrl
    }

    try{
          
        const userInfo = await User.findOne({_id:user_id})

        const userImg = await User.findByIdAndUpdate({_id:user_id} ,  {$set : newData})

        userInfo.password = undefined
        
        let token = jwt.sign({userInfo} ,
            process.env.SECRETKEY , {
            expiresIn: 60*60*1000
            })
        res.json({message: "Upload Image Successfully", token })  
      

    }catch(error){

        res.status(401).json({
            name: error.name , 
            message: error.message , 
            url: req.originalUrl
        })
    }
})


router.get('/myQuizzes/:id' ,  async (req , res) =>{

    let user_id = req.params.id;
    let myQuizzezArray = []

    try{

        const myQuizzes = await Quizes.find({creator: user_id})

        for(let i in myQuizzes){
        
            myQuizzezArray.push(myQuizzes[i])
        }

        res.json(myQuizzezArray)
       
    }catch(error){

        res.status(401).json({
            name: error.name , 
            message: error.message , 
            url: req.originalUrl
        })

    }
} )




module.exports = router
