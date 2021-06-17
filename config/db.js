const mongoose = require('mongoose');
const config = require('config');
const db =config.get('mongoURI');

const connectDb = async()=>{
    try{
        await mongoose.connect(db, {
            useNewUrlParser : true, 
            useUnifiedTopology:true,
            useCreateIndex:true,
            useFindAndModify: false
        });
        console.log("Mongo DB connected....");
    }catch(err){
        console.log(err.message);
        //exit process with failue
        process.exit(1);
    }
}

module.exports = connectDb;