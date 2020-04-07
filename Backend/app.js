const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require('mongoose');

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");

const HttpError = require('./models/http-error');

const app = express();

//this will convert json data to regular javascript object or array.
app.use(bodyParser.json());

//CORS 
app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
});

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);


app.use((req,res,next) => {
    const error = new HttpError('Could not find this path!',404);
    next(error);
})

app.use((error,req,res,next)=>{
    if(res.headerSent)
        return next(error);

    res.status(error.code || 500).json({message:error.message || 'An unknown error occured!'});
})

mongoose.connect('mongodb://alibulut:12345a@ds029801.mlab.com:29801/heroku_vvkglrgl', {useNewUrlParser:true, useCreateIndex:true, useUnifiedTopology:true})
.then(() => {
    app.listen(5000);
})
.catch(err => {
    console.log(err);
})

