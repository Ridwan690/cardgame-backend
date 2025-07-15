// middleware/upload.js
const multer = require("multer");

// Tipe file yang diizinkan
const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

// Validasi tipe file
const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // terima
  } else {
    cb(new Error("Hanya file JPG, JPEG, dan PNG yang diizinkan!"), false); // tolak
  }
};

// Gunakan memoryStorage karena kita upload ke Supabase langsung
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // Maksimum 2MB
  },
});

module.exports = upload;
