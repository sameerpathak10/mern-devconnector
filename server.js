const express = require('express');
const connectDB = require('./config/db');

const app = express();

//Connect to database 
connectDB();


//Init Middleware
app.use(express.json({extended: false}));
app.get('/', (req, res)=> {res.send('API running')});

//define routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/profiles", require("./routes/api/profiles"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/posts", require("./routes/api/posts"));



const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{ console.log(`Server is listening on port : ${PORT}`)});
