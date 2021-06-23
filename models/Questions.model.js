const mongoose = require("mongoose");

const questionsSchema = mongoose.Schema({



     Question:{type: String, required: true},
     Coreect_Answer:{type: String,    required: true},
     Incoreect:[]
  
    
}
 
);

 
 const Questions = mongoose.model('Questions', questionsSchema);
 
 module.exports = Questions;




 

 