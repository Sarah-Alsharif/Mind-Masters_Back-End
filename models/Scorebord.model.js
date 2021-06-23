const mongoose = require("mongoose");

const scorebordSchema = mongoose.Schema({

    
    
    quize_id:{
        type: mongoose.Schema.Types.ObjectId ,
        required: true,
        ref : 'Quizes',
    },
    
    top:[{

        user_id:{
            type: mongoose.Schema.Types.ObjectId ,
            ref : 'User'
        },
        name:{
            type: String , 
            required: true
        },

        score:{
            type: Number ,
            required: true

        }
    }
    ]

}
 
);
 
 
 
 const Scorebord = mongoose.model('Scorebord', scorebordSchema);
 
 module.exports = Scorebord;