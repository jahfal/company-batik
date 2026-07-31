// src/app/products/[id]/page.tsx

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import SectionHeader from "@/components/Common/SectionHeader";
import { API_BASE_URL } from "src/config/api";

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

const ProductDetailPage = () => {
  const params = useParams();
  const productId = params.id as string;
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProductDetail = useCallback(async () => {
    if (!productId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/product/${productId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setError("Produk tidak ditemukan.");
        } else {
          const errorData = await response.json();
          throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorData.message || 'Terjadi kesalahan di server.'}`);
        }
      }

      const data: Product = await response.json();
      setProduct(data);
    } catch (err: any) {
      setError(err.message || "Gagal mengambil detail produk.");
      console.error("Error fetching product detail:", err);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProductDetail();
  }, [fetchProductDetail]);

  // Render kondisi Loading, Error, atau Produk (Sudah ada)
  // ... (Kode Loading dan Error Anda yang sudah ada) ...

  if (loading) {
    return (
      <section className="overflow-hidden pb-20 pt-15 lg:pb-25 xl:pb-30">
        <div className="mx-auto max-w-c-1315 px-4 md:px-8 xl:px-0">
          {/* Tombol Kembali di Kiri Atas */}
          <div className="mb-5"> {/* Margin bawah untuk spasi */}
            <button onClick={() => router.back()} className="text-primary hover:text-primaryho flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Kembali
            </button>
          </div>
          <div className="animate_top mx-auto text-center">
            <SectionHeader headerInfo={{ title: `Detail Produk`, subtitle: `Memuat...`, description: `` }} />
            <p className="text-center text-lg text-black dark:text-white">Memuat detail produk...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="overflow-hidden pb-20 pt-15 lg:pb-25 xl:pb-30">
        <div className="mx-auto max-w-c-1315 px-4 md:px-8 xl:px-0">
          {/* Tombol Kembali di Kiri Atas */}
          <div className="mb-5">
            <button onClick={() => router.back()} className="text-primary hover:text-primaryho flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Kembali
            </button>
          </div>
          <div className="animate_top mx-auto text-center">
            <SectionHeader headerInfo={{ title: `Detail Produk`, subtitle: `Error`, description: `` }} />
            <p className="text-center text-lg text-red-500">Error: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="overflow-hidden pb-20 pt-15 lg:pb-25 xl:pb-30">
        <div className="mx-auto max-w-c-1315 px-4 md:px-8 xl:px-0">
          {/* Tombol Kembali di Kiri Atas */}
          <div className="mb-5">
            <button onClick={() => router.back()} className="text-primary hover:text-primaryho flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Kembali
            </button>
          </div>
          <div className="animate_top mx-auto text-center">
            <SectionHeader headerInfo={{ title: `Produk Tidak Ditemukan`, subtitle: `404`, description: `` }} />
            <p className="text-center text-lg text-black dark:text-white">Produk yang Anda cari tidak ada.</p>
          </div>
        </div>
      </section>
    );
  }


  return (
    <section className="overflow-hidden pb-20 pt-15 lg:pb-25 xl:pb-30">
      <div className="mx-auto max-w-c-1315 px-4 md:px-8 xl:px-0">
        <br/>
        <br/>
        {/* Tombol Kembali di Kiri Atas */}
        <div className="mb-5"> {/* Memberi spasi di bawah tombol kembali */}
          <button onClick={() => router.back()} className="text-primary hover:text-primaryho flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Kembali
          </button>
        </div>
        
      </div>

      <div className="relative mx-auto mt-15 max-w-[1207px] px-4 md:px-8 xl:mt-20 xl:px-0">
        <div className="flex flex-wrap lg:flex-nowrap gap-7.5 xl:gap-12.5 items-start">
          {/* Gambar Produk - Sisi Kiri */}
          {product.image_url && (
            <div className="relative w-full lg:w-1/2 h-96 overflow-hidden rounded-lg shadow-solid-10">
              {/* Menggunakan tag <img> standar sebagai pengganti komponen Image dari Next.js */}
              <div className="relative w-full lg:w-1/2 h-96 overflow-hidden rounded-lg shadow-solid-10">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover" // Tambahkan w-full h-full untuk mengisi div
                  style={{ objectFit: 'cover' }} // Properti CSS inline
                />
              </div>
            </div>
          )}

          {/* Detail Produk - Sisi Kanan */}
          <div className="w-full lg:w-1/2 rounded-lg border border-stroke bg-white p-7.5 shadow-solid-10 dark:border-strokedark dark:bg-blacksection dark:shadow-none xl:p-12.5">
            <h2 className="mb-4 text-3xl font-bold text-black dark:text-white">{product.name}</h2>
            <p className="mb-2 text-para2 font-medium text-black dark:text-white">
              Harga:  Rp{Math.floor(product.price).toLocaleString("id-ID")}{" "}
            </p>
            <p className="mb-2 text-para2 font-medium text-black dark:text-white">
              Kategori: {product.category}
            </p>
            {product.description && (
              <p className="mb-4 text-sm text-waterloo dark:text-manatee">
                Deskripsi: {product.description}
              </p>
            )}

            {/* Tombol E-commerce */}
            <div className="flex flex-wrap gap-2.5 border-t border-stroke pt-6 dark:border-strokedark">
              {product.tokopedia_url && (
                <a
                  href={product.tokopedia_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn inline-flex items-center gap-2.5 font-medium text-white transition-all duration-300 dark:text-white dark:hover:text-white bg-green-500 hover:bg-green-600 rounded-md py-2 px-4"
                  aria-label={`Buy on Tokopedia: ${product.name}`}
                >
                  <span className="duration-300 group-hover/btn:pr-2">
                    Beli di Tokopedia
                  </span>
                  <svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                    <path d="M10.4767 6.16701L6.00668 1.69701L7.18501 0.518677L13.6667 7.00034L7.18501 13.482L6.00668 12.3037L10.4767 7.83368H0.333344V6.16701H10.4767Z" />
                  </svg>
                </a>
              )}
              {product.shopee_url && (
                <a
                  href={product.shopee_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn inline-flex items-center gap-2.5 font-medium text-white transition-all duration-300 dark:text-white dark:hover:text-white bg-orange-500 hover:bg-orange-600 rounded-md py-2 px-4"
                  aria-label={`Buy on Shopee: ${product.name}`}
                >
                  <span className="duration-300 group-hover/btn:pr-2">
                    Beli di Shopee
                  </span>
                  <svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                    <path d="M10.4767 6.16701L6.00668 1.69701L7.18501 0.518677L13.6667 7.00034L7.18501 13.482L6.00668 12.3037L10.4767 7.83368H0.333344V6.16701H10.4767Z" />
                  </svg>
                </a>
              )}
            </div>
            {/* Hapus tombol Kembali lama di sini */}
            {/* <button className="mt-5 mx-auto block bg-primary text-white py-2 px-4 rounded" onClick={() => router.back()}>
              Kembali
            </button> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailPage;