// routes/login.js
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const moment = require("moment");
const PunchFormController = require("../controller/punchFormDataController");
const punchControllerView = require("../controller/punchExcelAddController");
const punchExcelViewController = require("../controller/punchExcelViewController");
const punchExcelImportController = require("../controller/punchExcelImport");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("login.ejs", console.log("route working"));
});
router.post("/submit", PunchFormController.submitForm);

router.get("/view", (req, res) => {
  res.render("view.ejs", console.log("route working"));
});

router.get("/excel-view", (req, res) => {
  res.render("excel-view.ejs", console.log("route working"));
});

//router.post("/view-excel-view", PunchFormController);
router.get("/excel-import", (req, res) => {
  res.render("excel-import.ejs", console.log("route working"));
});
//router.post("/excel-import-upload", punchExcelImportController.uploadFile);
const uploads = multer({ dest: "uploads/" });
router.post(
  "/excel-import-upload",
  uploads.single("uploadedFile"),
  punchExcelImportController.uploadFile
);

router.post("/view-excel-view", punchExcelViewController.viewExcelView);
//router.get('/', punchExcelImportController.uploadForm);
const upload = multer({ dest: "upload/" });
router.post(
  "/upload",
  upload.single("uploadedFile"),
  punchControllerView.uploadFile
);
module.exports = router;


















//router.post("/excel-import-upload", punchExcelImportController.uploadFile);
/* router.post("/excel-import-upload",(req,res)=>{
  console.log("working")});  ഇതൊരു വലിയ അറിവാണ്*/
