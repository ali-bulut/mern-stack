const uuid = require('uuid/v4');
const HttpError = require("../models/http-error");

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Maiden Tower",
    description: "One of the most famous place in the world!",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/9/92/Maiden_tower.JPG",
    address: "Salacak, Üsküdar Salacak Mevkii, 34668 Üsküdar/İstanbul",
    location: {
      lat: 41.0211216,
      lng: 29.0041105
    },
    creator: "u1"
  }
];

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find(p => p.id === placeId);

  if (!place)
    return next(
      new HttpError("Could not find a place for the provided id!", 404)
    );

  res.json({ place: place });
};

const getPlaceByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const place = DUMMY_PLACES.find(p => p.creator === userId);

  if (!place)
    return next(
      new HttpError("Could not find a place for the provided id!", 404)
    );

  res.json({ place: place });
};

const createPlace = (req, res, next) => {
    const { title, description, coordinates, address, creator } = req.body;
    const createdPlace={
        id: uuid(),
        title,
        description,
        location:coordinates,
        address,
        creator
    }

    DUMMY_PLACES.push(createdPlace);

    res.status(201).json({place: createdPlace});
};

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
