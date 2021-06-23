const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png
const userSchema = mongoose.Schema({


    email: {
        type: String ,
        required: true,
        lowerCase: true,

        unique: true
    },

    admin: {
        type: Boolean,
        default: false
    },

    firstName: {
        type: String,
        required: true
    },

    lastName: {

        type: String,
        required: true
    },
    password: {

        type: String,
        required: true
    },

    profileImg: {
        type: String,
        default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png'
    }



}, {timestamp : true})



userSchema.pre("save" , function(next , done){

    
    let salt = bcrypt.genSaltSync();
    let hash = bcrypt.hashSync(this.password , salt);

    this.password = hash;
    next();
})


const User = mongoose.model('User' , userSchema);
module.exports = User;