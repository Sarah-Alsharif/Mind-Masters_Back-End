const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Category = require('../models/Categories.model');
const Quizes = require('../models/Quizes.model');

// get all Category
router.get('/allCategory' , async (req , res)=>{

    try{
        const allCategory = await Category.find()
      
        res.json({"allCategory": allCategory})

    }catch(error){

        res.status(401).json({
            name: error.name , 
            message: error.message , 
            url: req.originalUrl
        })
    }
    
})   
     
// add new Category
router.post('/addCategory' , async (req , res)=>{

    const name = req.body.categoryName
    const image = req.body.image

    try{
        const categoryName = await new Category({categoryName: name, categoryImage: image})
        await categoryName.save()
        res.json({message: "Category Created Successfully"})
    }catch(error){

        res.status(401).json({
            name: error.name , 
            message: "Failed to create Category" , 
            url: req.originalUrl
        })
    }
})


// get all Quizes
router.get('/allQuizzes/:id' , async (req , res)=>{
 
    let category_id = req.params.id;
    const arrayOfQuiz = []

    try{
        const selectCategory = await Category.findById(category_id)
        const allQuiezzes = selectCategory.Quizes;

         for(let i in allQuiezzes){
           
            const specificQuiz = await Quizes.findOne(allQuiezzes[i].quizId)
            arrayOfQuiz.push(specificQuiz)    
        }

        res.json(arrayOfQuiz)
     
    }catch(error){

        res.status(401).json({
            name: error.name , 
            message: error.message , 
            url: req.originalUrl
        })
    }
})





module.exports = router