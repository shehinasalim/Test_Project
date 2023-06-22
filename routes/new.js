const express=require("express");
const router = express.Router();
const PunchViewFormController=require('../controller/PunchViewFormController');

router.get("/", (req, res) => {
    res.render("new-view.ejs", console.log("route working"));
  });

//   router.get("/up", (req, res) => {
//     res.render("up.ejs", console.log("route working"));
//   });

router.post("/upload", PunchViewFormController.selectAllData);
//   router.post("/upload", (req, res) => {
//     res.render("upload.ejs", console.log("route working"));
//   });

  module.exports = router;