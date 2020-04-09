const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require('mongoose');
const fs = require('fs');
const path = require('path');

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");

const HttpError = require('./models/http-error');

const app = express();

//this will convert json data to regular javascript object or array.
app.use(bodyParser.json());

//if there is a request to /uploads/images we open the uploads and images folders to the public!
//if we dont use that we cant access from the client to these folders so also images.
app.use('/uploads/images', express.static(path.join('uploads', 'images')))

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
    //if there is an error we will delete the image file. 
    if(req.file){
        fs.unlink(req.file.path, (err) => {
            console.log(err);
        });
    }
    if(res.headerSent)
        return next(error);

    res.status(error.code || 500).json({message:error.message || 'An unknown error occured!'});
})

mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ds029801.mlab.com:29801/${process.env.DB_NAME}`, {useNewUrlParser:true, useCreateIndex:true, useUnifiedTopology:true})
.then(() => {
    app.listen(5000);
})
.catch(err => {
    console.log(err);
})

