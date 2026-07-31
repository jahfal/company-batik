// src/app/products/category/[categoryName]/page.tsx

"use client"; // Ini adalah Client Component

import React, { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation"; // Untuk mendapatkan URL saat ini

// Impor komponen yang dibutuhkan untuk tampilan katalog Anda
import SectionHeader from "@/components/Common/SectionHeader"; // Asumsi path SectionHeader
import Image from "next/image"; // Untuk menampilkan gambar produk
import Link from "next/link"; // Pastikan Link dari Next.js diimpor
import { API_BASE_URL } from "src/config/api";

// Interface Product yang sudah Anda definisikan
interface Product {
  id_product: number;
  name: string;
  description?: string;
  price: number;
  category: string;
  image_url?: string;
  tokopedia_url?: string | null;
  shopee_url?: string | null;
}

const CategoryProductCatalog = () => {
  const pathname = usePathname(); // Dapatkan path URL saat ini
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);

  // Fungsi untuk mendapatkan nama kategori dari URL
  const getCategoryFromPath = useCallback((path: string): string | null => {
    const parts = path.split('/');
    if (parts.length > 0) {
      const categorySlug = parts[parts.length - 1];
      // Ubah slug menjadi nama yang lebih mudah dibaca (misal: baju-pria -> Baju Pria)
      return categorySlug.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
    return null;
  }, []);

  // Membungkus fetchProducts dalam useCallback agar fungsinya stabil
  const fetchProducts = useCallback(async (category: string | null) => {
    if (!category) {
      setLoading(false);
      setError("Kategori tidak ditemukan di URL.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      console.log(`Fetching products for category: ${category}`);
      const encodedCategory = encodeURIComponent(category);
      const response = await fetch(`${API_BASE_URL}/product?category=${encodedCategory}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! Status: ${response.status}. Message: ${
            errorData.message || "Terjadi kesalahan di server."
          }`
        );
      }

      const data: Product[] = await response.json();
      setProducts(data);
    } catch (err: any) {
      setError(err.message || "Gagal mengambil data produk berdasarkan kategori.");
      console.error("Error fetching category products:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const categoryName = getCategoryFromPath(pathname);
    setCurrentCategory(categoryName);
    if (categoryName) {
      fetchProducts(categoryName);
    }
  }, [pathname, fetchProducts, getCategoryFromPath]);

  // Render kondisi Loading
  if (loading) {
    return (
      <section className="overflow-hidden pb-20 pt-15 lg:pb-25 xl:pb-30">
        <div className="mx-auto max-w-c-1315 px-4 md:px-8 xl:px-0">
          <div className="animate_top mx-auto text-center">
            <SectionHeader
              headerInfo={{
                title: `Katalog Produk`,
                subtitle: `Memuat Produk Kategori ${currentCategory || ''}...`,
                description: ``,
              }}
            />
          </div>
        </div>
        <div className="relative mx-auto mt-15 max-w-[1207px] px-4 md:px-8 xl:mt-20 xl:px-0">
          <p className="text-center text-lg text-black dark:text-white">Memuat produk, harap tunggu...</p>
        </div>
      </section>
    );
  }

  // Render kondisi Error
  if (error) {
    return (
      <section className="overflow-hidden pb-20 pt-15 lg:pb-25 xl:pb-30">
        <div className="mx-auto max-w-c-1315 px-4 md:px-8 xl:px-0">
          <div className="animate_top mx-auto text-center">
            <SectionHeader
              headerInfo={{
                title: `Katalog Produk`,
                subtitle: `Gagal Memuat Kategori ${currentCategory || ''}`,
                description: `Terjadi kesalahan saat mengambil produk.`,
              }}
            />
          </div>
        </div>
        <div className="relative mx-auto mt-15 max-w-[1207px] px-4 md:px-8 xl:mt-20 xl:px-0">
          <p className="text-center text-lg text-red-500">Error: {error}</p>
          <button
            className="mt-5 mx-auto block bg-primary text-white py-2 px-4 rounded"
            onClick={() => fetchProducts(currentCategory)}
          >
            Coba Lagi
          </button>
        </div>
      </section>
    );
  }

  // Render konten utama (daftar produk)
  return (
    <>
      <section className="overflow-hidden pb-20 pt-15 lg:pb-25 xl:pb-30">
        <div className="mx-auto max-w-c-1315 px-4 md:px-8 xl:px-0">
          <div className="animate_top mx-auto text-center">
            <br/>
            <SectionHeader
              headerInfo={{
                title: `${currentCategory || 'Semua'} Produk`,
                subtitle: `Jelajahi Koleksi Batik Kami`,
                description: `Temukan koleksi batik terbaik dalam kategori ${currentCategory || 'ini'}.`,
              }}
            />
          </div>
        </div>

        <div className="relative mx-auto mt-15 max-w-[1207px] px-4 md:px-8 xl:mt-20 xl:px-0">
          <div className="absolute -bottom-15 -z-1 h-full w-full">
            <Image
              fill
              src="/images/shape/shape-dotted-light.svg"
              alt="Dotted"
              className="dark:hidden"
            />
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {products.length > 0 ? (
              products.map((product) => (
                <div // Main card container
                  className="animate_top group relative flex flex-col rounded-lg border border-stroke bg-white p-2 shadow-solid-10 dark:border-strokedark dark:bg-blacksection dark:shadow-none w-40 min-h-[300px]"
                  key={product.id_product}
                >
                  {/* Gambar Produk */}
                  {product.image_url && (
                    <div className="relative mb-2 h-32 w-full overflow-hidden rounded-lg">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="object-contain transition-all duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}

                  {/* Informasi Produk (Nama dan Harga) */}
                  <div className="px-1 text-black dark:text-white flex flex-col flex-grow">
                     {/* Nama Produk */}
                    <h4 className="text-sm font-medium text-black dark:text-white leading-tight mb-2 overflow-hidden line-clamp-2"> {/* line-clamp-2 untuk 2 baris */}
                      {product.name}
                    </h4>

                    {/* Harga Produk */}
                    <h3 className="mb-0.5 text-base font-bold text-black dark:text-white">
                      Rp{Math.floor(product.price).toLocaleString("id-ID")}{" "}
                    </h3>

                    {/* Tombol Detail */}
                    <div className="mt-auto pt-2">
                      <Link
                        href={`/products/${product.id_product}`}
                        className="group/btn inline-flex items-center gap-1 font-medium text-primary transition-all duration-300 hover:text-primary text-sm"
                      >
                        <span className="duration-300 group-hover/btn:pr-0">
                          View Details
                        </span>
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 14 14"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10.4767 6.16701L6.00668 1.69701L7.18501 0.518677L13.6667 7.00034L7.18501 13.482L6.00668 12.3037L10.4767 7.83368H0.333344V6.16701H10.4767Z"
                            fill="currentColor"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center w-full">
                <p className="text-lg text-black dark:text-white">Tidak ada produk yang tersedia.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default CategoryProductCatalog;