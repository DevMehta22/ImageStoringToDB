require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const multer = require("multer");
const imgSchema = require("./Modules/imgSchema");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "Uploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
  fileFilter: (res, file, cb) => {
    checkFileType(file, cb);
  },
}).single("Image");

checkFileType = (file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    return cb("Error:This type of files is not allowed");
  }
};

app.use(express.json());
app.set("view engine", "ejs");
app.get("/", (req, res) => {
  imgSchema.find({}).then((data, err) => {
    if (err) {
      console.log(err.message);
    } else {
      res.render("Img", { items: data });
    }
  });
});

app.post("/upload", (req, res) => {
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
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to DB!");
    const port = process.env.PORT || 4000;
    app.listen(port, (err) => {
      if (err) throw err.message;
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
