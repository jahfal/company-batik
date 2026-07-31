const Product = require("../models/Product");
const { sendError } = require("../utils/errorHelpers"); // Asumsi sendError ada dan berfungsi dengan baik

// GET /api/product
exports.getAllproduct = async (req, res) => {
  try {
    const { category } = req.query; // <-- Ambil parameter 'category' dari query string
    let whereClause = {}; // Objek untuk kondisi filter Sequelize

    if (category) {
      // Jika parameter category ada, tambahkan kondisi filter
      whereClause.category = category;
    }

    const product = await Product.findAll({
      where: whereClause // Terapkan kondisi filter
    });
    return res.json(product);
  } catch (error) {
    return sendError(res, 500, "Error fetching product", error);
  }
};

// POST /api/product (hanya admin)
exports.createProduct = async (req, res) => {
  // image_url akan datang dari frontend setelah proses upload terpisah
  const { name, description, price, category, image_url, tokopedia_url, shopee_url } = req.body;

  try {
    // Validasi dasar
    if (!name || !price || !category) {
      return res.status(400).json({ message: "Nama, Harga, Kategori wajib diisi." });
    }
    // ... validasi lain jika diperlukan

    const newProduct = await Product.create({
      name,
      description,
      price: parseFloat(price),
      category,
      image_url: image_url, // Simpan URL yang didapat dari frontend
      tokopedia_url: tokopedia_url,
      shopee_url: shopee_url
    });

    return res.status(201).json({ message: "Produk berhasil ditambahkan", product: newProduct }); // <-- Tambahkan 'return'
  } catch (error) {
    console.error("Error creating product:", error);
    // Hanya panggil sendError, jangan panggil res.status().json() lagi
    return sendError(res, 500, "Server error saat membuat produk", error); // <-- Tambahkan 'return' dan gunakan sendError
  }
};

// PUT /api/product/:id (hanya admin)
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  // Ambil image_url dari body request
  const { name, description, price, category, image_url, tokopedia_url, shopee_url } = req.body; // <-- Ambil image_url dari req.body

  try {
    const product = await Product.findByPk(id);

    if (!product) {
      return sendError(res, 404, "Product not found"); // <-- Pastikan ada 'return'
    }

    // Perbarui properti produk
    product.name = name || product.name; // Gunakan operator OR untuk mempertahankan nilai lama jika yang baru null/undefined
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.image_url = image_url; // <-- Pastikan ini mengambil dari req.body yang sudah dideklarasikan
    product.tokopedia_url = tokopedia_url;
    product.shopee_url = shopee_url;

    await product.save();
    // console.log("Produk setelah disimpan (backend):", product.toJSON()); // Log untuk debugging

    return res.status(200).json({ message: "Produk berhasil diperbarui", product: product }); // <-- Tambahkan 'return'
  } catch (error) {
    console.error("Error updating product:", error);
    // HANYA PANGGIL sendError, JANGAN PANGGIL res.status().json() lagi
    return sendError(res, 500, "Server error saat memperbarui produk", error); // <-- Tambahkan 'return' dan gunakan sendError
  }
};

// DELETE /api/product/:id (hanya admin)
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);

    if (!product) {
      return sendError(res, 404, "Product not found"); // <-- Pastikan ada 'return'
    }

    await product.destroy();
    return res.status(204).json({ message: "Product deleted successfully" }); // <-- Tambahkan 'return' (meskipun 204 biasanya tidak ada body, return penting)
  } catch (error) {
    return sendError(res, 500, "Error deleting product", error); // <-- Tambahkan 'return'
  }
};

// GET /api/product/:id (get by ID)
exports.getProductById = async (req, res) => {
  const { id } = req.params; // ID produk dari URL

  try {
    const product = await Product.findByPk(id); // Mencari produk berdasarkan Primary Key

    if (!product) {
      return sendError(res, 404, "Product not found"); // Menggunakan sendError jika tidak ditemukan
    }

    return res.json(product); // Mengembalikan objek produk
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return sendError(res, 500, "Error fetching product details", error);
  }
};