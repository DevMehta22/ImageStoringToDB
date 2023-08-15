const express = require("express");
const { getImg, postImg } = require("../Controllers/imgControllers");

const router = express.Router();

router.get("/", getImg);
router.post("/upload", postImg);
module.exports = router;
