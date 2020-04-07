// const uuid = require("uuid/v4");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const getUsers = async (req, res, next) => {
  let users;
  try {
    //by using this we cant reach the users' passwords.
    users = await User.find({}, "-password");

    //by using this we can only reach email and name properties of the users
    // const user = User.find({}, 'email name')
  } catch (err) {
      const error = new HttpError('Fetching users failed, please try again later!', 500);
      return next(error);
  }
  
  res.json({users:users.map(user => user.toObject({getters:true}))})
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data!", 422)
    );
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later!",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User already exists, please login instead!",
      422
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image:
      "https://avatars2.githubusercontent.com/u/53226554?s=460&u=5608076f8a8d017db5345a223a9a6234d5c50975&v=4",
    password,
    places: []
  });

  let result;
  try {
    result = await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again!", 500);
    return next(error);
  }

  res.status(201).json({ user: result.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let identifiedUser;
  try {
    identifiedUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later!",
      500
    );
    return next(error);
  }

  if (!identifiedUser || identifiedUser.password !== password) {
    return next(
      new HttpError(
        "Could not identify user, credentials seem to be wrong.",
        401
      )
    );
  }

  res.json({ message: "Logged In!", user: identifiedUser.toObject({getters:true}) });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
