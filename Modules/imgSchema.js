const mongoose = require("mongoose");

const imgSchema = new mongoose.Schema({
  imgName: {
    type: String,
    required: true,
  },
  imgDesc: {
    type: String,
  },
  img: {
    data: Buffer,
    contentType: String,
  },
});

module.exports = mongoose.model("ImgFiles", imgSchema);
