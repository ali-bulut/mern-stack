const HttpError = require("../models/http-error");
const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
    //we did it because the browser is acting like that the request's method is options but it's not.
    //so we check it whether method is Options or not.
    if(req.method === 'OPTIONS'){
        return next();
    }
  try {
    const token = req.headers.authorization.split(" ")[1]; // Authorization : 'Bearer TOKEN'
    if (!token) {
      throw new Error("Authentication failed!");
    }
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    //we created a variable to the request and the userId is included in this variable.
    //so if we have decodedToken we can allow the user to log in.
    req.userData = {userId: decodedToken.userId}
    next();
  } catch (err) {
    return next(new HttpError("Authentication failed!", 401));
  }
};
