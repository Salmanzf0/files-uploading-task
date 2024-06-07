const express = require("express");
const {
  uploadFile,
  getAFile,
  getAllFiles,
  deleteAFile,
} = require("../controllers/fileController.js");


const router = express.Router();

// /api/v1/robot
router.post("/upload", uploadFile);
router.get("/get/:id", getAFile);
router.delete("/delete/:id", deleteAFile);
router.get("/all", getAllFiles);

module.exports = router;
