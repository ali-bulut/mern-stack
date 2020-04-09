// const uuid = require("uuid/v4");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const fs = require('fs');

const HttpError = require("../models/http-error");
const Place = require("../models/place");
const User = require("../models/user");

const getCoordsForAddress = require("../util/location");

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a place!",
      500
    );
    return next(error);
  }

  if (!place)
    return next(
      new HttpError("Could not find a place for the provided id!", 404)
    );

  //by using toObject we can be able to access id from db as string.
  //_id -> is coming from db as objectId
  //id -> is also coming from db but as string
  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  //   const places = await Place.find(p=>p.creator === userId);

//   let places;
    let userWithPlaces;
  try {
    // places = await Place.find({ creator: userId });
    userWithPlaces=await User.findById(userId).populate('places');
  } catch (err) {
    const error = new HttpError(
      "Fetching places failed, please try again!",
      500
    );
    return next(error);
  }

  if (!userWithPlaces.places || userWithPlaces.places.length === 0)
    return next(
      new HttpError("Could not find any places for the provided id!", 404)
    );

  //because places is array and we cannot reach toObject method directly. So we have to map the array
  //and should reverse each place.
  res.json({ places: userWithPlaces.places.map(place => place.toObject({ getters: true })) });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data!", 422)
    );
  }

  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: req.file.path,
    creator
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError(
      "Creating place failed, please try again later!",
      500
    );
    return next(error);
  }

  if (!user) {
    return next(new HttpError("Could not find user for provided id!"));
  }

  try {
    //usage of transactions (doesnt work!)
    // const session = await mongoose.startSession();
    //await session.startTransaction();
    await createdPlace.save(/*{ session: session }*/);

    user.places.push(createdPlace);
    await user.save(/*{ session: session }*/);

    //ending of transaction and after that our changes will be added to db.
    // await session.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating place failed, please try again!",
      500
    );
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlaceById = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data!", 422)
    );
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a place!",
      500
    );
    return next(error);
  }

  if(place.creator.toString() !== req.userData.userId){
    const error = new HttpError(
      "You are not allowed to edit this place!",
      401
    );
    return next(error);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      "Updating place failed, please try again!",
      500
    );
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
      //if ref field is exist in Place schema then we can use populate!
      //by using this we can reach the user schema on place schema.
      //place.creator.places for example
    place = await Place.findById(placeId).populate('creator');
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a place!",
      500
    );
    return next(error);
  }

  if(!place){
      return next(new HttpError('Could not find place for this id', 404));
  }

  if(place.creator.id !== req.userData.userId){
    const error = new HttpError(
      "You are not allowed to delete this place!",
      401
    );
    return next(error);
  }

  const imagePath=place.image;

  try {
    await place.remove();
    //by using pull we will delete the placeId in the user schema.
    place.creator.places.pull(place);
    await place.creator.save();
  } catch (err) {
    const error = new HttpError(
      "Deleting place failed, please try again!",
      500
    );
    return next(error);
  }

  fs.unlink(imagePath, (err) => {
    console.log(err);
  });

  res.status(200).json({ message: "The Place has been deleted!" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;
