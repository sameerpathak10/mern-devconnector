const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

const app = express();

//Connect to database 
connectDB();


//Init Middleware
app.use(express.json({extended: false}));
app.get('/', (req, res)=> {res.send('API running')});

//define routes
app.use("/api/users", require("./routes/api/usersAPI"));
app.use("/api/profiles", require("./routes/api/profilesAPI"));
app.use("/api/auth", require("./routes/api/authAPI"));
app.use("/api/posts", require("./routes/api/postsAPI"));


//serve  static assets in production
if(process.env.NODE_ENV ==='production'){
    //set staic folder
    app.use(express.static('client/build'));
    app.get('*',(rq,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'));
    });
}
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{ console.log(`Server is listening on port : ${PORT}`)});
