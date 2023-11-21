require('dotenv').config()
const mongoose = require('mongoose');
exports.connectMongoose =()=>{
    mongoose.connect(process.env.DATABASE_URL
    )
    .then((e)=>console.log("Connected to Mongodb "))
    .catch((e)=>console.log("Error in connecting with mongodb"))
}




