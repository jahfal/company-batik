"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // <-- Tambahkan useRouter
import { useEffect, useState, useCallback } from "react"; // <-- Tambahkan useCallback

import ThemeToggler from "./ThemeToggler";
import menuData from "./menuData";
import { API_BASE_URL } from "src/config/api";

// --- Definisi Interface Produk untuk Kategori ---
interface Product {
  category: string; // Hanya perlu category untuk ini
}

// --- Definisi Interface untuk Item Menu (sesuai menuData) ---
interface MenuItem {
  id: number;
  title: string;
  newTab: boolean;
  path?: string;
  submenu?: MenuItem[];
}
// --- End Interface Definitions ---

const Header = () => {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [dropdownToggler, setDropdownToggler] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const pathUrl = usePathname();
  const router = useRouter(); // Inisialisasi useRouter

  // --- State untuk Data Navigasi Dinamis dan Status Kategori ---
  const [dynamicMenuData, setDynamicMenuData] = useState<MenuItem[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  // --- End State untuk Data Navigasi ---

  // --- State untuk Status Login ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // --- End State untuk Status Login ---

  // Sticky menu logic
  const handleStickyMenu = () => {
    if (window.scrollY >= 80) {
      setStickyMenu(true);
    } else {
      setStickyMenu(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);
    // Cleanup event listener
    return () => window.removeEventListener("scroll", handleStickyMenu);
  }, []);

  // --- Fetch Categories for Product Dropdown ---
  const fetchCategories = useCallback(async () => {
    try {
      setLoadingCategories(true);
      setCategoriesError(null);
      const response = await fetch(`${API_BASE_URL}/product`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Tidak perlu Authorization header jika endpoint publik
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data: Product[] = await response.json();

      const uniqueCategories = [...new Set(data.map((product) => product.category))];

      const categorySubmenuItems: MenuItem[] = uniqueCategories.map((cat, index) => ({
        id: 300 + index, // ID unik
        title: cat,
        newTab: false,
        path: `/products/category/${cat.toLowerCase().replace(/\s+/g, '-')}`, // Contoh path untuk kategori
      }));

      // Update menuData untuk item "Product"
      const updatedMenu = menuData.map((item) => {
        if (item.title === "Product") {
          return { ...item, submenu: categorySubmenuItems };
        }
        return item;
      });
      setDynamicMenuData(updatedMenu);

    } catch (err: any) {
      setCategoriesError(err.message || "Failed to fetch categories.");
      console.error("Error fetching categories:", err);
    } finally {
      setLoadingCategories(false);
    }
  }, []);
  // --- End Fetch Categories ---

  // --- Check Login Status ---
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem("authToken") : null;
      const loggedInFlag = typeof window !== 'undefined' ? localStorage.getItem("isLoggedIn") : null;

      if (token && loggedInFlag === "true") {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };

    checkAuthStatus(); // Check on mount
    
    // Listen for storage changes
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', checkAuthStatus);
      return () => {
        window.removeEventListener('storage', checkAuthStatus);
      };
    }
  }, []);
  // --- End Check Login Status ---

  // --- Call fetchCategories on mount ---
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]); // fetchCategories sebagai dependency

  // --- Handle Logout ---
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userId");
      localStorage.removeItem("isLoggedIn");
    }
    setIsLoggedIn(false);
    router.push("/authentication/sign-in"); // Redirect ke halaman login
  };
  // --- End Handle Logout ---


  return (
    <header
      className={`fixed left-0 top-0 z-99999 w-full py-7 ${
        stickyMenu
          ? "bg-white py-4! shadow-sm transition duration-100 dark:bg-black"
          : ""
      }`}
    >
      <div className="relative mx-auto max-w-c-1390 items-center justify-between px-4 md:px-8 xl:flex 2xl:px-0">
        <div className="flex w-full items-center justify-between xl:w-1/4">
          <Link href="/">
            <Image
              src="/images/logo/logo-dark.svg"
              alt="logo"
              width={119.03}
              height={30}
              className="hidden w-full dark:block"
            />
            <Image
              src="/images/logo/logo-light.svg"
              alt="logo"
              width={119.03}
              height={30}
              className="w-full dark:hidden"
            />
          </Link>

          {/* */}
          <button
            aria-label="hamburger Toggler"
            className="block xl:hidden"
            onClick={() => setNavigationOpen(!navigationOpen)}
          >
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              <span className="absolute right-0 block h-full w-full">
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 rounded-sm bg-black delay-0 duration-200 ease-in-out dark:bg-white ${
                    !navigationOpen ? "w-full! delay-300" : "w-0"
                  }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${
                    !navigationOpen ? "delay-400 w-full!" : "w-0"
                  }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${
                    !navigationOpen ? "w-full! delay-500" : "w-0"
                  }`}
                ></span>
              </span>
              <span className="du-block absolute right-0 h-full w-full rotate-45">
                <span
                  className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${
                    !navigationOpen ? "h-0! delay-0" : "h-full"
                  }`}
                ></span>
                <span
                  className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${
                    !navigationOpen ? "h-0! delay-200" : "h-0.5"
                  }`}
                ></span>
              </span>
            </span>
          </button>
          {/* */}
        </div>

        {/* Nav Menu Start   */}
        <div
          className={`invisible h-0 w-full items-center justify-between xl:visible xl:flex xl:h-auto xl:w-full ${
            navigationOpen &&
            "navbar visible! mt-4 h-auto max-h-[400px] rounded-md bg-white p-7.5 shadow-solid-5 dark:bg-blacksection xl:h-auto xl:p-0 xl:shadow-none xl:dark:bg-transparent"
          }`}
        >
          <nav>
            <ul className="flex flex-col gap-5 xl:flex-row xl:items-center xl:gap-10">
              {dynamicMenuData.map((menuItem, key) => ( // <-- Gunakan dynamicMenuData
                <li key={key} className={menuItem.submenu ? "group relative" : ""}> {/* Pastikan class 'group relative' hanya jika ada submenu */}
                  {menuItem.submenu ? (
                    <>
                      <button
                        onClick={() => setDropdownToggler(!dropdownToggler)}
                        className="flex cursor-pointer items-center justify-between gap-3 hover:text-primary"
                      >
                        {menuItem.title}
                        <span>
                          <svg
                            className="h-3 w-3 cursor-pointer fill-waterloo group-hover:fill-primary"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                          >
                            <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                          </svg>
                        </span>
                      </button>

                      <ul
                        className={`dropdown ${dropdownToggler ? "flex" : ""}`}
                      >
                        {loadingCategories && <li className="px-4 py-2 text-sm text-black dark:text-white">Loading categories...</li>}
                        {categoriesError && <li className="px-4 py-2 text-sm text-red-500">Error: {categoriesError}</li>}
                        {!loadingCategories && !categoriesError && menuItem.submenu.map((subItem, subKey) => (
                          <li key={subKey} className="hover:text-primary">
                            <Link href={subItem.path || "#"}>{subItem.title}</Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <Link
                      href={`${menuItem.path}`}
                      className={
                        pathUrl === menuItem.path
                          ? "text-primary hover:text-primary"
                          : "hover:text-primary"
                      }
                    >
                      {menuItem.title}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-7 flex items-center gap-6 xl:mt-0">
            <ThemeToggler />

            {/* --- Render Kondisional Tombol Auth --- */}
            {isLoggedIn ? (
              // Jika login, tampilkan tombol Logout
              <button
                onClick={handleLogout}
                className="flex items-center justify-center rounded-full bg-primary px-7.5 py-2.5 text-regular text-white duration-300 ease-in-out hover:bg-primaryho"
              >
                Logout
              </button>
            ) : (
              // Jika belum login, tampilkan Sign In dan Sign Up
              <>
                {/* <Link
                  href="/authentication/sign-in" // Sesuaikan path jika berbeda
                  className="text-regular font-medium text-waterloo hover:text-primary"
                >
                  Sign In
                </Link> */}

                {/* <Link
                  href="/authentication/sign-up" // Sesuaikan path jika berbeda
                  className="flex items-center justify-center rounded-full bg-primary px-7.5 py-2.5 text-regular text-white duration-300 ease-in-out hover:bg-primaryho"
                >
                  Sign Up
                </Link> */}
              </>
            )}
            {/* --- End Render Kondisional Tombol Auth --- */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;