const mongoose = require("mongoose");

const CategorySchema = mongoose.Schema({
   
    categoryName:{
        type : String,
        required : true, 
    },

    categoryImage:{
        type : String,
        required : true, 
    },

    Quizes:[
        {

        quizId:{
            type: mongoose.Schema.Types.ObjectId , 
            ref: 'Quizes',
        }

        }
    ]

});

const Category =  mongoose.model("Category" , CategorySchema);

module.exports = Category;

