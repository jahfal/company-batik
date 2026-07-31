"use client";

import Image from "next/image";
import SectionHeader from "../Common/SectionHeader";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  stock?: number;
}

const Pricing = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching products from API...');
      const response = await fetch(`${API_BASE_URL}/product`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log('API Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error Response:', errorData);
        throw new Error(
          `HTTP error! Status: ${response.status}. Message: ${
            errorData.message || "Terjadi kesalahan di server."
          }`
        );
      }

      const data: Product[] = await response.json();
      console.log('Products data received:', data);
      setProducts(data);
    } catch (err: any) {
      setError(err.message || "Gagal mengambil data produk.");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
      console.log('Loading state set to false.');
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (loading) {
    return (
      <section className="overflow-hidden pb-20 pt-15 lg:pb-25 xl:pb-30">
        <div className="mx-auto max-w-c-1315 px-4 md:px-8 xl:px-0">
          <div className="animate_top mx-auto text-center">
            <SectionHeader
              headerInfo={{
                title: `Katalog Produk`,
                subtitle: `Memuat Produk...`,
                description: ``,
              }}
            />
          </div>
        </div>
        <div className="relative mx-auto mt-15 max-w-[1207px] px-4 md:px-8 xl:mt-20 xl:px-0">
          <p className="text-center text-lg text-black dark:text-white">Memuat data produk, harap tunggu...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="overflow-hidden pb-20 pt-15 lg:pb-25 xl:pb-30">
        <div className="mx-auto max-w-c-1315 px-4 md:px-8 xl:px-0">
          <div className="animate_top mx-auto text-center">
            <SectionHeader
              headerInfo={{
                title: `Katalog Produk`,
                subtitle: `Gagal Memuat`,
                description: `Terjadi kesalahan saat mengambil produk.`,
              }}
            />
          </div>
        </div>
        <div className="relative mx-auto mt-15 max-w-[1207px] px-4 md:px-8 xl:mt-20 xl:px-0">
          <p className="text-center text-lg text-red-500">Error: {error}</p>
          <button
            className="mt-5 mx-auto block bg-primary text-white py-2 px-4 rounded"
            onClick={fetchProducts}
          >
            Coba Lagi
          </button>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="overflow-hidden pb-20 pt-15 lg:pb-25 xl:pb-30">
        <div className="mx-auto max-w-c-1315 px-4 md:px-8 xl:px-0">
          <div className="animate_top mx-auto text-center">
            <SectionHeader
              headerInfo={{
                title: `OUR PRODUCTS`,
                subtitle: `Explore Our Latest Batik Collection`,
                description: `Temukan koleksi batik terbaru kami, dengan desain unik dan kualitas terbaik.`,
              }}
            />
          </div>
        </div>

        <div className="relative mx-auto mt-15 max-w-[1207px] px-4 md:px-8 xl:mt-20 xl:px-0">
          <div className="absolute -bottom-15 -z-1 h-full w-full">
            <Image
              fill
              src="./images/shape/shape-dotted-light.svg"
              alt="Dotted"
              className="dark:hidden"
            />
          </div>
          <div className="flex flex-wrap justify-center gap-4"> {/* <-- Ubah gap dan non-flex-nowrap */}
            {products.length > 0 ? (
              products.map((product) => (
                <div
                  className="animate_top group relative flex flex-col rounded-lg border border-stroke bg-white p-2 shadow-solid-10 dark:border-strokedark dark:bg-blacksection dark:shadow-none w-40 min-h-[300px]" // <-- Kunci utama: set width (w-40) dan min-height
                  key={product.id_product}
                >
                  {/* Gambar Produk */}
                  {product.image_url && (
                    <div className="relative mb-2 h-32 w-full overflow-hidden rounded-lg"> {/* <-- H-32 untuk gambar lebih kecil */}
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="object-contain transition-all duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}

                  {/* Informasi Produk */}
                  <div className="px-1 text-black dark:text-white flex flex-col flex-grow"> {/* <-- Flex-grow untuk informasi */}
                

                    {/* Nama Produk */}
                    <h4 className="text-xs font-medium text-black dark:text-white leading-tight mb-2 overflow-hidden line-clamp-2">
                      {product.name}  
                    </h4>

                    {/* Harga Produk */}
                    <h3 className="mb-0.5 text-base font-bold text-black dark:text-white"> {/* <-- Font lebih kecil, margin lebih kecil */}
                     Rp{Math.floor(product.price).toLocaleString("id-ID")}{" "}
                    </h3>

                    {/* Tombol Detail */}
                    <div className="mt-auto pt-2"> {/* <-- mt-auto untuk mendorong ke bawah, pt-2 untuk padding atas */}
                      <Link
                        href={`/products/${product.id_product}`}
                        className="group/btn inline-flex items-center gap-1 font-medium text-primary transition-all duration-300 hover:text-primary text-sm"
                      >
                        <span className="duration-300 group-hover/btn:pr-0"> {/* <-- pr-0 untuk menghilangkan animasi panah */}
                          View Details
                        </span>
                        <svg
                          width="12" height="12" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg"
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

export default Pricing;