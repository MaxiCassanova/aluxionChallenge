const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config();
const uri = process.env.URI_DB;

const connect = async () => {
    try {
        await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        });
        console.log("The database is connected");
    }catch(err){
        console.log(err);
    }
}

module.exports = connect;