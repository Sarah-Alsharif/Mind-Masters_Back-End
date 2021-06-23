require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT;
const cors = require('cors');
const mongoose = require('mongoose');


app.use(cors())


mongoose.connect(process.env.mongoDBURL , {
    useNewUrlParser: true,
    useUnifiedTopology:true
} , () => {
    console.log('connected to DB');
})


app.use(express.urlencoded({extended: true}))
app.use(express.json());


//Import routes
const auth = require('./routes/auth')
const category = require('./routes/category')
const quiz = require('./routes/quiz')
// Mount Routes
app.use('/auth' , auth);
app.use('/category' , category);
app.use('/quiz' , quiz)





app.listen(PORT , () => {
    console.log(`Running on Port : ${PORT}`)
})

