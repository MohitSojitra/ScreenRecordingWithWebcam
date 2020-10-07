const express = require("express");
const bodyPaser = require("body-parser");
const multer = require("multer");
const cors = require("cors");

const app = express();
app.use(bodyPaser.json());
app.use(cors());

const Storage = multer.diskStorage({
  destination: (req, file, cb) => {
    return cb(null, "public/videos");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const videoFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(mp4|mkv|webm)$/)) {
    cb(new Error("You upload only images :) "), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: Storage,
  fileFilter: videoFilter,
});

app.get("/", async (req, res, next) => {
  console.log("grt run");
  res.status("200").contentType("application/json").json({ success: "200" });
});

// app.get("/:movieName", async (req, res, next) => {
//   let data = await index(req.params.movieName);

//   res.status("200").contentType("application/json").json(data);
// });

app.post("/post", upload.single("recordVideo"), async (req, res, next) => {
  console.log(req.body);
  //   let url = req.body.url;
  //   let data = await AllInfoMovie(url);
  res.status("200").contentType("application/json").json({ success: "200" });
});

app.listen("3000", () => {
  console.log("server is running");
});
