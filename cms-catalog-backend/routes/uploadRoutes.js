// routes/uploadRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path'); // Diperlukan untuk mendapatkan ekstensi file

const router = express.Router();

// Konfigurasi penyimpanan Multer untuk penyimpanan disk lokal
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // cb(error, destination)
        cb(null, 'uploads/'); // Gambar akan disimpan di folder 'uploads/'
    },
    filename: (req, file, cb) => {
        // cb(error, filename)
        // Memberi nama file yang unik berdasarkan timestamp + ekstensi asli
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Filter jenis file (opsional, tapi disarankan)
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif') {
        cb(null, true); // Izinkan file gambar
    } else {
        cb(new Error('Hanya file gambar (JPEG, PNG, GIF) yang diizinkan!'), false); // Tolak file lain
    }
};

const upload = multer({ 
    storage: storage, 
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Batasan ukuran file (misal 5MB)
});

// Rute POST untuk mengunggah satu file gambar
router.post('/upload', upload.single('productImage'), (req, res) => {
    // 'productImage' adalah nama field di form-data frontend

    if (!req.file) {
        // Jika tidak ada file yang diunggah atau file ditolak oleh filter
        return res.status(400).json({ message: 'Tidak ada file gambar yang diunggah atau jenis file tidak didukung.' });
    }

    // Dapatkan URL publik dari file yang diunggah
    // Asumsi server backend berjalan di http://localhost:3000
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    res.status(200).json({
        message: 'File berhasil diunggah secara lokal.',
        filePath: imageUrl, // Ini URL yang akan disimpan ke database
    });
});

module.exports = router;