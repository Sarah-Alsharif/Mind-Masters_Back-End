const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Quize = require('../models/Quizes.model');
const Questions =require('../models/Questions.model');
const User = require('../models/User.model')
const Category = require('../models/Categories.model')
const Scoreboard = require('../models/Scorebord.model')


// add new Quize
router.post('/addQuiz' , async (req , res)=>{

    const userEmail = req.body.userEmail
    const quistions = req.body.questions
    const quizInfo = req.body.quizInfo
    const quistionsId = []
    

try{
    
    const user = await User.findOne({email: userEmail})
    let quizId;

    for(let i in quistions){

        const newQuistion = await new Questions({
           Question:quistions[i].question , Coreect_Answer:quistions[i].corecct ,
             Incoreect: [quistions[i].firstAnswer ,quistions[i].secoundAnswer , quistions[i].thirdAnswer]
          
        })
        await newQuistion.save()
        const currentQuestion = await Questions.findOne({Question:quistions[i].question})
        quistionsId.push(currentQuestion._id)
        
        const quiz = await Quize.findOne({quizeName: quizInfo.quizName})


        if(quiz){
            
            quiz.questions.push({quistionId: quistionsId[i]})
            const updateQuiz = await Quize.findByIdAndUpdate(quiz._id , {questions:quiz.questions})
            await updateQuiz.save()
            quizId = quiz._id
            

        }else{

            const newQuiz = await new Quize({creator: user._id, quizeName: quizInfo.quizName, difficultyLevel: quizInfo.difficultyLevel , questions: [{quistionId: quistionsId[i]}]})
            await newQuiz.save()
         
        }


        if(i == quistions.length-1){
            const category = await Category.findOne({categoryName: quizInfo.categoryName})
            category.Quizes.push({quizId: quiz._id})
            const updateCategory = await Category.findByIdAndUpdate(category._id , {Quizes: category.Quizes})
        }

    }

    const score = await new Scoreboard({quize_id: quizId})
    console.log(score)
    await score.save()
 
}catch(error){

    res.status(401).json({
        name: error.name , 
        message: error.message , 
        url: req.originalUrl
    })
}
})

//allQuestions

router.get('/allQuestions/:id' , async (req , res)=>{

    let quiz_id = req.params.id;
    const arrayOfQuestion = []

    try{
        const selectQuiz = await Quize.findById(quiz_id)
        const allQuestion = selectQuiz.questions;

         for(let i in allQuestion){
           
            const specificQuestion = await Questions.findOne(allQuestion[i].quistionId)
            arrayOfQuestion.push(specificQuestion)    
        }

        res.json(arrayOfQuestion)
     
    }catch(error){

        res.status(401).json({
            name: error.name , 
            message: error.message , 
            url: req.originalUrl
        })
    }
})


// add score to scoreboard
router.post('/addScore' , async (req,res)=>{
    
    userId = req.body.userId
    score = req.body.score
    quizId = req.body.quizId 


    try{

       const user = await User.findOne({_id: userId})
       const fullName = user.firstName+" "+user.lastName
       const quizScoreboard = await Scoreboard.findOne({quize_id: quizId})
       let userRecord;
       let isRegisterd = false;
       
       
        // this part will be executed if soreboard is empty
        if(quizScoreboard.top.length == 0){

            quizScoreboard.top.push({user_id: userId, name: fullName, score: score})
            await Scoreboard.findByIdAndUpdate(quizScoreboard._id , {top: quizScoreboard.top})
            res.json("congratulations, you have been added to the top 10 scoreboard")


        }else{


            // find user record in scoreboard
            for(let score in quizScoreboard.top){

                if(quizScoreboard.top[score].user_id == userId){
                    isRegisterd = true
                    userRecord = quizScoreboard.top[score] 
                    break;
                }
            }
            // this part will be executed if user is registered in scoreboard
            if(isRegisterd){
                // check if user score is higher than the prev score
                if(userRecord.score < score){
                    userRecord.score = score
                    quizScoreboard.top.sort((b, a) => (a.score > b.score) ? 1 : -1)
                    await Scoreboard.findByIdAndUpdate(quizScoreboard._id , {top: quizScoreboard.top})
                    res.json(quizScoreboard.top)
                    res.json("congratulations, you have been added to the top 10 scoreboard")

                }
                res.json(quizScoreboard.top)

            // this part will be executed if user is not registered in scoreboard
            }else{
                // this part will be executed if soreboard is not full yet
                if(quizScoreboard.top.length < 10){

                    quizScoreboard.top.push({user_id: userId, name: fullName, score: score})
                    quizScoreboard.top.sort((b, a) => (a.score > b.score) ? 1 : -1)
                    await Scoreboard.findByIdAndUpdate(quizScoreboard._id , {top: quizScoreboard.top})
                    res.json(quizScoreboard.top)
                    res.json("congratulations, you have been added to the top 10 scoreboard")


                // this part will be executed if scoreboard is full
                }else{
                    const minScore = quizScoreboard.top[quizScoreboard.top.length - 1].score
                    if(minScore < score){
                        quizScoreboard.top.splice(quizScoreboard.top.length - 1 , 1)
                        quizScoreboard.top.push({user_id: userId, name: fullName, score: score})
                        quizScoreboard.top.sort((b, a) => (a.score > b.score) ? 1 : -1)
                        await Scoreboard.findByIdAndUpdate(quizScoreboard._id , {top: quizScoreboard.top})
                        res.json("congratulations, you have been added to the top 10 scoreboard")
                    }
                }
            }
        } 

    }catch(error){

        res.status(401).json({
            name: error.name , 
            message: error.message , 
            url: req.originalUrl
        })

    }

})


router.get('/showScoreBoard/:id' , async (req,res)=>{

    let quizId = req.params.id
    
    try{

        const quizScoreboard = await Scoreboard.findOne({quize_id: quizId})
        res.json(quizScoreboard.top)
        

    }catch(error){
        res.status(401).json({
            name: error.name , 
            message: error.message , 
            url: req.originalUrl
        })
    }

})



router.post('/deleteQuiz' , async (req , res)=>{
       
const quizId = req.body.quizId;

try{
    
    //console.log(quizId)
    const quiz = await Quize.findById({_id:quizId})
    const quizQuestions = quiz.questions;

    // delete question
    for(let i in quizQuestions){
        const question = await Questions.findByIdAndDelete({_id: quizQuestions[i].quistionId})
    } 

    // delete quiz from category
    const categories = await Category.find()

    for(let category in categories){
    
         const newArray = categories[category].Quizes.map(ele => ele.quizId)

        if(newArray.includes(quizId)){
            const quizIndex = newArray.indexOf(quizId)
            categories[category].Quizes.splice(quizIndex , 1)
            categories[category].save() 
        }     
    }

    // delete score board
    const deleteScore = await Scorebord.findOneAndDelete({quize_id:quizId})
    // delete quiz
    const deleteQuiz = await Quize.findByIdAndDelete({_id:quizId})  

    res.json({message: "Delete Quiz successfully"})  
}

catch(error){
 
    res.status(401).json({
        name: error.name , 
        message: error.message , 
        url: req.originalUrl
    })
}
})


module.exports = router