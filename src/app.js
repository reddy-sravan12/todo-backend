

//external dependencies
const express=require('express');
const dotenv=require('dotenv');
const cors=require('cors');

const authRouter=require('./routes/authRouter');
const  handleError  = require('./middlewares/errorHandlers');


dotenv.config()
const app=express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded())


app.use('/auth',authRouter)

app.use(handleError)


module.exports=app;