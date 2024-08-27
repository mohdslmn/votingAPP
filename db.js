const mongoose = require("mongoose");
require("dotenv").config();
// const mongoURL = 'mongodb://127.0.0.1:27017/voting' ;

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser : true,
    useUnifiedTopology : true
});
const db = mongoose.connection;

db.on('connected',() =>{
    console.log("connected to db server")
});
db.on('error',() => {
    console.log("Mongodb Connection error:")
});
db.on('disconnection',() => {
    console.log("MongoDB Disconnected")
});

module.exports = db;