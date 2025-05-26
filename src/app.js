

//external dependencies
const express=require('express');
const dotenv=require('dotenv');
const cors=require('cors');


dotenv.config()

const app=express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded())


app.use((req,res)=>{
    res.send('<h1>Hello Backend!, journey starts here</h1>',200)
})




module.exports=app;