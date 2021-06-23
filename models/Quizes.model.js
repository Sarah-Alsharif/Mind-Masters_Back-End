const mongoose = require('mongoose');


const quizsSchema = mongoose.Schema({

  creator:{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
   },

   quizeName:{
     type: String,
     required: true
   },


   difficultyLevel:{
     type: String,
     required: true
   },

  


   questions:[
     {

      quistionId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Questions'
      }
     }
  ]

  
},
{ 
    timestamps : true
  
});



const Quizes = mongoose.model('Quizes', quizsSchema);

module.exports = Quizes;