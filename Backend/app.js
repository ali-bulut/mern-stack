const express = require("express");
const bodyParser = require("body-parser");

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");

const HttpError = require('./models/http-error');

const app = express();

//this will convert json data to regular javascript object or array.
app.use(bodyParser.json());

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

app.listen(5000);
