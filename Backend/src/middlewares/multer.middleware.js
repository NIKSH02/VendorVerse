const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/temp'); // Specify the directory to save the uploaded files
    },
    filename: (req, file, cb) => {
     
      cb(null, file.filename); // Generate a unique filename
    }
  });

  const upload = multer({
    storage:storage,
  });

  module.exports = upload; // Export the upload object
  