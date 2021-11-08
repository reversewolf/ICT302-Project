const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const validateForm = require('../controllers/validationController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage, limits: {
  fileSize: 100000000, // 100mb file size
  fields: 5, // maximum 5 files
}, fileFilter: (req, file, cb) => {
  if(file.mimetype == 'application/msword' || file.mimetype == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.mimetype == 'application/pdf') {
    cb(null, true);
  }else {
    cb(null, false);
  }
} });

// Get SSS request portal
router.get("/student-support-staff", (req, res) => {
  res.sendFile(path.join(__dirname,"../public/views/student-support-staff-request-portal.html"));
});

// Get Student request portal
router.get("/student", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/views/student-request-portal.html"));
});

// Get SSS form data
router.post("/student-support-staff/submit", upload.single('file'), async (req, res) => {
  var isValidated = await validateForm.validateSSSForm(req.body, req.file);
  if (isValidated) {
    console.log("Validated...");
    console.log("Updating database...");
    console.log("Sending email...");
    return res.sendStatus(200);
  }
  return res.sendStatus(400);
});

// Get Student form data
router.post("/student/submit", upload.single('file'), async (req, res) => {
  var isValidated = await validateForm.validateStudentForm(req.body, req.file);
  if(isValidated){
    console.log("Validated...");
    console.log("Updating database...");
    console.log("Sending email...");
    return res.sendStatus(200);
  }
  res.sendStatus(400);
});

module.exports = router;