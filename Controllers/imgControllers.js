const { upload } = require("../upload");
const imgSchema = require("../Modules/imgSchema");
const fs = require("fs");
const path = require("path");

const getImg = (req, res) => {
  imgSchema.find({}).then((data, err) => {
    if (err) {
      console.log(err.message);
    } else {
      res.render("Img", { items: data });
    }
  });
};

const postImg = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.render("Img", {
        msg: err,
      });
    } else {
      if (req.file == undefined) {
        res.render("Img", {
          msg: "Error:No File selected",
        });
      } else {
        const obj = {
          imgName: req.body.imgName,
          imgDesc: req.body.imgDesc,
          img: {
            data: fs.readFileSync(
              path.join(__dirname + "/Uploads/" + req.file.filename)
            ),
          },
        };

        imgSchema.create(obj).then(() => {
          res.redirect("/");
        });
      }
    }
  });
};

module.exports = {
  getImg,
  postImg,
};
