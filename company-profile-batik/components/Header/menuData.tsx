// menuData.ts
import { Menu } from "@/types/menu"; // Pastikan Menu interface Anda sesuai

const menuData: Menu[] = [
  {
    id: 1,
    title: "Home",
    newTab: false,
    path: "/",
  },
  {
    id: 2,
    title: "Features",
    newTab: false,
    path: "/#features",
  },
  {
    id: 2.1,
    title: "Blog",
    newTab: false,
    path: "/blog",
  },
  {
    id: 2.3,
    title: "Docs",
    newTab: false,
    path: "/docs",
  },
  {
    id: 3, // ID untuk dropdown Product
    title: "Product", // <-- Ubah judul menjadi "Product"
    newTab: false,
    submenu: [], // <-- Kosongkan submenu di sini, akan diisi dinamis
  },
  {
    id: 4,
    title: "Support",
    newTab: false,
    path: "/support",
  },
];

export default menuData;