const File = require("../models/file.js");

const uploadFile = async (req, res) => {
  try {
    const fileData = req.body.files;

    if (!Array.isArray(fileData)) {
      return res.status(400).json({ message: "Invalid file data" });
    }

    const uploadedFiles = await Promise.all(
      fileData.map(async (file) => {
        const newFile = new File({
          name: file.name,
          url: file.url,
          type: file.type,
        });
        return newFile.save();
      })
    );

    res
      .status(200)
      .json({ message: "Files uploaded successfully", files: uploadedFiles });
  } catch (err) {
    console.error("Error uploading files:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAFile = async (req, res, next) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      res.status(404).json({ message: "File Not Found!" });
    }

    res.status(200).json(file);
  } catch (error) {
    next(error);
  }
};

const deleteAFile = async (req, res, async) => {
  try {
    await File.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "File deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllFiles = async (req, res, next) => {
  try {
    const files = await File.find().sort({ _id: -1 });
    res.status(200).json(files);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadFile,
  getAFile,
  getAllFiles,
  deleteAFile,
};
