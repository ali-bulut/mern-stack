const express = require("express");
const { check } = require("express-validator");

const router = express.Router();

const { getUsers, signup, login } = require("../controllers/users-controller");
const fileUpload = require('../middlewares/file-upload');

router.get("/", getUsers);

router.post(
  "/signup",
  fileUpload.single('image'),
  [
    check("name")
      .not()
      .isEmpty(),
    check("email").isEmail().normalizeEmail(),
    check("password").isLength({ min: 6 })
  ],
  signup
);

router.post("/login", login);

module.exports = router;
