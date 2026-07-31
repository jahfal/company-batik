"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Products",
      [
        {
          name: "Batik Parang Rusak Kuno",
          description: "Batik tulis klasik dengan motif Parang Rusak, terbuat dari katun primisima.",
          price: 350000.00,
          category: "Baju Pria",
          image_url: "http://localhost:3000/uploads/batik_parang_rusak.jpg", // Contoh URL lokal
          tokopedia_url: "https://www.tokopedia.com/toko-batik-anda/batik-parang-rusak-kuno", // <-- Tambahkan link Tokopedia
          shopee_url: null, // <-- Opsional, bisa null jika tidak ada link Shopee
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Selendang Batik Mega Mendung",
          description: "Selendang sutra dengan motif Mega Mendung khas Cirebon, cocok untuk acara formal.",
          price: 180000.00,
          category: "Aksesoris Wanita",
          image_url: "http://localhost:3000/uploads/batik_mega_mendung.jpg",
          tokopedia_url: null,
          shopee_url: "https://shopee.co.id/toko-batik-anda-selendang-mega-mendung", // <-- Tambahkan link Shopee
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Kemeja Batik Modern Abstrak",
          description: "Kemeja batik cap dengan desain modern dan motif abstrak kontemporer.",
          price: 220000.00,
          category: "Baju Pria",
          image_url: "http://localhost:3000/uploads/batik_modern_abstrak.jpg",
          tokopedia_url: "https://www.tokopedia.com/toko-batik-anda/kemeja-batik-modern-abstrak",
          shopee_url: "https://shopee.co.id/toko-batik-anda-kemeja-modern-abstrak",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Tas Tangan Batik Jumputan",
          description: "Tas tangan unik dari bahan batik jumputan, ramah lingkungan dan stylish.",
          price: 150000.00,
          category: "Tas & Dompet",
          image_url: "http://localhost:3000/uploads/tas_jumputan.jpg",
          tokopedia_url: "https://www.tokopedia.com/toko-batik-anda/tas-tangan-batik-jumputan",
          shopee_url: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    // Hati-hati dengan perintah down. BulkDelete akan menghapus semua data di tabel Product.
    // Anda bisa menghapus berdasarkan kondisi jika ingin lebih spesifik.
    await queryInterface.bulkDelete("Products", null, {}); // <-- Sesuaikan nama tabel menjadi "Products"
  },
};