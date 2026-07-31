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
    if (!req.file) {
        return res.status(400).json({ message: 'Tidak ada file gambar yang diunggah atau jenis file tidak didukung.' });
    }

    // UBAH BARIS INI: Gunakan BASE_URL dari .env agar otomatis HTTPS di produksi
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;

    res.status(200).json({
        message: 'File berhasil diunggah secara lokal.',
        filePath: imageUrl, 
    });
});

module.exports = router;