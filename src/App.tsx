import { useEffect, useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Beranda from "./pages/Beranda";
import Katalog from "./pages/Katalog";
import Favorit from "./pages/Favorit";
import Keranjang from "./pages/Keranjang";
import RiwayatPesanan from "./pages/RiwayatPesanan";
import ProfilSaya from "./pages/ProfilSaya";
import AdminDashboard from "./pages/AdminDashboard";
import type { UserData } from "./types/user";
import { foods } from "./data/foods";
import UserDashboard from "./pages/UserDashboard";
import type { CartItem, Order } from "./types/food";
import { createOrder, fetchOrders, updateOrderStatus } from "./services/api";
const ONGKIR = 10000;

const ORDERS_STORAGE_KEY = "kulineran-mantap-orders";
const CART_STORAGE_KEY = "kulineran-mantap-cart";
const FAVORITES_STORAGE_KEY = "kulineran-mantap-favorites";

const pageDescriptions: Record<string, string> = {
  Dashboard: "Pantau aktivitas dan pesanan kulineranmu.",
  Beranda: "Temukan inspirasi makanan untuk menemani harimu.",
  Katalog: "Cari dan pilih makanan favoritmu.",
  Favorit: "Kumpulan makanan yang kamu sukai.",
  Keranjang: "Atur pesanan sebelum checkout.",
  "Riwayat Pesanan": "Pantau daftar dan status pesananmu.",
  "Profil Saya": "Kelola informasi profil dan aktivitas akunmu.",
  "Dashboard Admin": "Pantau penjualan dan kelola status pesanan.",
};

function readSavedValue<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);

    if (!saved) return fallback;

    return JSON.parse(saved) as T;
  } catch {
    return fallback;
  }
}

function getSavedOrders(): Order[] {
  const saved = readSavedValue<unknown>(ORDERS_STORAGE_KEY, []);

  return Array.isArray(saved) ? (saved as Order[]) : [];
}

function getSavedCart(): CartItem[] {
  const saved = readSavedValue<unknown>(CART_STORAGE_KEY, []);

  return Array.isArray(saved) ? (saved as CartItem[]) : [];
}

function getSavedFavorites(): number[] {
  const saved = readSavedValue<unknown>(FAVORITES_STORAGE_KEY, []);

  return Array.isArray(saved)
    ? saved.filter((value): value is number => Number.isInteger(value))
    : [];
}

function App() {
  const [activePage, setActivePage] = useState("Dashboard Admin");

  const [favorites, setFavorites] = useState<number[]>(getSavedFavorites);

  const [cart, setCart] = useState<CartItem[]>(getSavedCart);

  const [orders, setOrders] = useState<Order[]>(getSavedOrders);

  const [userList, setUserList] = useState<UserData[]>([
    {
      id: 1,
      name: "Joko Anwar",
      email: "jkfilm@gmail.com",
      role: "Admin",
      createdAt: "09 November 2026",
    },
    {
      id: 2,
      name: "Nadia Putri",
      email: "nadia.admin@gmail.com",
      role: "Admin",
      createdAt: "08 November 2026",
    },
    {
      id: 3,
      name: "Rizky Pratama",
      email: "rizky.admin@gmail.com",
      role: "Admin",
      createdAt: "07 November 2026",
    },
    {
      id: 4,
      name: "Dinda Maharani",
      email: "dinda.admin@gmail.com",
      role: "Admin",
      createdAt: "06 November 2026",
    },
    {
      id: 5,
      name: "Fajar Ramadhan",
      email: "fajar.admin@gmail.com",
      role: "Admin",
      createdAt: "05 November 2026",
    },

    // 50 PELANGGAN
    {
      id: 6,
      name: "Xaviera Putri",
      email: "xaviera@gmail.com",
      role: "Pelanggan",
      createdAt: "09 November 2026",
    },
    {
      id: 7,
      name: "Loopy",
      email: "loopy@gmail.com",
      role: "Pelanggan",
      createdAt: "09 November 2026",
    },
    {
      id: 8,
      name: "Pororo",
      email: "pororo@gmail.com",
      role: "Pelanggan",
      createdAt: "08 November 2026",
    },
    {
      id: 9,
      name: "Ara",
      email: "ara@gmail.com",
      role: "Pelanggan",
      createdAt: "10 November 2026",
    },
    {
      id: 10,
      name: "Kevin",
      email: "kevin@gmail.com",
      role: "Pelanggan",
      createdAt: "07 November 2026",
    },
    {
      id: 11,
      name: "Sandy",
      email: "sandy@gmail.com",
      role: "Pelanggan",
      createdAt: "06 November 2026",
    },
    {
      id: 12,
      name: "Maudy Ayunda",
      email: "maudy@gmail.com",
      role: "Pelanggan",
      createdAt: "05 November 2026",
    },
    {
      id: 13,
      name: "Andi Saputra",
      email: "andi.saputra@gmail.com",
      role: "Pelanggan",
      createdAt: "04 November 2026",
    },
    {
      id: 14,
      name: "Siti Nurhaliza",
      email: "siti.nur@gmail.com",
      role: "Pelanggan",
      createdAt: "03 November 2026",
    },
    {
      id: 15,
      name: "Budi Santoso",
      email: "budi.santoso@gmail.com",
      role: "Pelanggan",
      createdAt: "02 November 2026",
    },
    {
      id: 16,
      name: "Putri Amelia",
      email: "putri.amelia@gmail.com",
      role: "Pelanggan",
      createdAt: "01 November 2026",
    },
    {
      id: 17,
      name: "Dimas Pratama",
      email: "dimas.pratama@gmail.com",
      role: "Pelanggan",
      createdAt: "31 Oktober 2026",
    },
    {
      id: 18,
      name: "Nabila Zahra",
      email: "nabila.zahra@gmail.com",
      role: "Pelanggan",
      createdAt: "30 Oktober 2026",
    },
    {
      id: 19,
      name: "Rafi Akbar",
      email: "rafi.akbar@gmail.com",
      role: "Pelanggan",
      createdAt: "29 Oktober 2026",
    },
    {
      id: 20,
      name: "Citra Lestari",
      email: "citra.lestari@gmail.com",
      role: "Pelanggan",
      createdAt: "28 Oktober 2026",
    },
    {
      id: 21,
      name: "Fahri Maulana",
      email: "fahri.maulana@gmail.com",
      role: "Pelanggan",
      createdAt: "27 Oktober 2026",
    },
    {
      id: 22,
      name: "Alya Safitri",
      email: "alya.safitri@gmail.com",
      role: "Pelanggan",
      createdAt: "26 Oktober 2026",
    },
    {
      id: 23,
      name: "Rangga Firmansyah",
      email: "rangga.f@gmail.com",
      role: "Pelanggan",
      createdAt: "25 Oktober 2026",
    },
    {
      id: 24,
      name: "Nadya Aprilia",
      email: "nadya.aprilia@gmail.com",
      role: "Pelanggan",
      createdAt: "24 Oktober 2026",
    },
    {
      id: 25,
      name: "Ilham Ramadhan",
      email: "ilham.ramadhan@gmail.com",
      role: "Pelanggan",
      createdAt: "23 Oktober 2026",
    },
    {
      id: 26,
      name: "Maya Salsabila",
      email: "maya.salsabila@gmail.com",
      role: "Pelanggan",
      createdAt: "22 Oktober 2026",
    },
    {
      id: 27,
      name: "Reza Fahlevi",
      email: "reza.fahlevi@gmail.com",
      role: "Pelanggan",
      createdAt: "21 Oktober 2026",
    },
    {
      id: 28,
      name: "Dewi Anggraini",
      email: "dewi.anggraini@gmail.com",
      role: "Pelanggan",
      createdAt: "20 Oktober 2026",
    },
    {
      id: 29,
      name: "Ardiansyah Putra",
      email: "ardiansyah@gmail.com",
      role: "Pelanggan",
      createdAt: "19 Oktober 2026",
    },
    {
      id: 30,
      name: "Larasati Putri",
      email: "larasati@gmail.com",
      role: "Pelanggan",
      createdAt: "18 Oktober 2026",
    },
    {
      id: 31,
      name: "Bagas Wijaya",
      email: "bagas.wijaya@gmail.com",
      role: "Pelanggan",
      createdAt: "17 Oktober 2026",
    },
    {
      id: 32,
      name: "Intan Permata",
      email: "intan.permata@gmail.com",
      role: "Pelanggan",
      createdAt: "16 Oktober 2026",
    },
    {
      id: 33,
      name: "Yoga Pratama",
      email: "yoga.pratama@gmail.com",
      role: "Pelanggan",
      createdAt: "15 Oktober 2026",
    },
    {
      id: 34,
      name: "Aisyah Rahma",
      email: "aisyah.rahma@gmail.com",
      role: "Pelanggan",
      createdAt: "14 Oktober 2026",
    },
    {
      id: 35,
      name: "Farhan Hidayat",
      email: "farhan.hidayat@gmail.com",
      role: "Pelanggan",
      createdAt: "13 Oktober 2026",
    },
    {
      id: 36,
      name: "Vina Oktaviani",
      email: "vina.oktaviani@gmail.com",
      role: "Pelanggan",
      createdAt: "12 Oktober 2026",
    },
    {
      id: 37,
      name: "Daffa Alfarizi",
      email: "daffa.alfarizi@gmail.com",
      role: "Pelanggan",
      createdAt: "11 Oktober 2026",
    },
    {
      id: 38,
      name: "Nisa Aulia",
      email: "nisa.aulia@gmail.com",
      role: "Pelanggan",
      createdAt: "10 Oktober 2026",
    },
    {
      id: 39,
      name: "Rizal Maulana",
      email: "rizal.maulana@gmail.com",
      role: "Pelanggan",
      createdAt: "09 Oktober 2026",
    },
    {
      id: 40,
      name: "Sarah Amelia",
      email: "sarah.amelia@gmail.com",
      role: "Pelanggan",
      createdAt: "08 Oktober 2026",
    },
    {
      id: 41,
      name: "Fikri Ramadhan",
      email: "fikri.ramadhan@gmail.com",
      role: "Pelanggan",
      createdAt: "07 Oktober 2026",
    },
    {
      id: 42,
      name: "Nazwa Khairunnisa",
      email: "nazwa.k@gmail.com",
      role: "Pelanggan",
      createdAt: "06 Oktober 2026",
    },
    {
      id: 43,
      name: "Aditya Nugraha",
      email: "aditya.nugraha@gmail.com",
      role: "Pelanggan",
      createdAt: "05 Oktober 2026",
    },
    {
      id: 44,
      name: "Shinta Maharani",
      email: "shinta.maharani@gmail.com",
      role: "Pelanggan",
      createdAt: "04 Oktober 2026",
    },
    {
      id: 45,
      name: "Rian Setiawan",
      email: "rian.setiawan@gmail.com",
      role: "Pelanggan",
      createdAt: "03 Oktober 2026",
    },
    {
      id: 46,
      name: "Bella Novitasari",
      email: "bella.novita@gmail.com",
      role: "Pelanggan",
      createdAt: "02 Oktober 2026",
    },
    {
      id: 47,
      name: "Akbar Maulana",
      email: "akbar.maulana@gmail.com",
      role: "Pelanggan",
      createdAt: "01 Oktober 2026",
    },
    {
      id: 48,
      name: "Tiara Anjani",
      email: "tiara.anjani@gmail.com",
      role: "Pelanggan",
      createdAt: "30 September 2026",
    },
    {
      id: 49,
      name: "Rendy Kurniawan",
      email: "rendy.kurniawan@gmail.com",
      role: "Pelanggan",
      createdAt: "29 September 2026",
    },
    {
      id: 50,
      name: "Melati Puspita",
      email: "melati.puspita@gmail.com",
      role: "Pelanggan",
      createdAt: "28 September 2026",
    },
    {
      id: 51,
      name: "Gilang Ramadhan",
      email: "gilang.ramadhan@gmail.com",
      role: "Pelanggan",
      createdAt: "27 September 2026",
    },
    {
      id: 52,
      name: "Novi Amelia",
      email: "novi.amelia@gmail.com",
      role: "Pelanggan",
      createdAt: "26 September 2026",
    },
    {
      id: 53,
      name: "Hafiz Alfarizi",
      email: "hafiz.alfarizi@gmail.com",
      role: "Pelanggan",
      createdAt: "25 September 2026",
    },
    {
      id: 54,
      name: "Della Puspitasari",
      email: "della.puspita@gmail.com",
      role: "Pelanggan",
      createdAt: "24 September 2026",
    },
    {
      id: 55,
      name: "Raka Saputra",
      email: "raka.saputra@gmail.com",
      role: "Pelanggan",
      createdAt: "23 September 2026",
    },
  ]);

  const [showUserForm, setShowUserForm] = useState(false);

  const [editingUser, setEditingUser] = useState<number | null>(null);

  const [viewUser, setViewUser] = useState<UserData | null>(null);

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    role: "Pelanggan" as UserData["role"],
  });

  // Simpan keranjang ke localStorage.
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error("Keranjang gagal disimpan:", error);
    }
  }, [cart]);

  // Simpan favorit ke localStorage.
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error("Favorit gagal disimpan:", error);
    }
  }, [favorites]);

  // Simpan cache pesanan lokal.
  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (error) {
      console.warn("Cache pesanan gagal disimpan:", error);
    }
  }, [orders]);

  // Ambil data pesanan dari backend.
  useEffect(() => {
    let cancelled = false;

    async function loadOrders() {
      try {
        const serverOrders = await fetchOrders();

        if (cancelled) return;

        setOrders(serverOrders);

        try {
          localStorage.setItem(
            ORDERS_STORAGE_KEY,
            JSON.stringify(serverOrders),
          );
        } catch {
          // Cache lokal bersifat opsional.
        }
      } catch (error) {
        console.warn("Backend belum tersedia. Menggunakan cache lokal.", error);

        if (!cancelled) {
          setOrders(getSavedOrders());
        }
      }
    }

    void loadOrders();

    return () => {
      cancelled = true;
    };
  }, []);

  function handleToggleFavorite(id: number) {
    setFavorites((previous) =>
      previous.includes(id)
        ? previous.filter((favoriteId) => favoriteId !== id)
        : [...previous, id],
    );
  }

  function handleAddToCart(id: number) {
    const food = foods.find((item) => item.id === id);

    if (!food) return;

    setCart((previous) => {
      const existing = previous.find((item) => item.food.id === id);

      if (existing) {
        return previous.map((item) =>
          item.food.id === id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        );
      }

      return [...previous, { food, quantity: 1 }];
    });
  }

  function handleUpdateQuantity(id: number, delta: number) {
    setCart((previous) =>
      previous
        .map((item) =>
          item.food.id === id
            ? {
                ...item,
                quantity: item.quantity + delta,
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function handleRemoveItem(id: number) {
    setCart((previous) => previous.filter((item) => item.food.id !== id));
  }

  async function handleCheckout(diskon = 0) {
    if (cart.length === 0) {
      window.alert("Keranjang masih kosong.");
      return;
    }

    const subtotal = cart.reduce(
      (sum, item) => sum + item.food.price * item.quantity,
      0,
    );

    const diskonValid = Math.min(Math.max(0, Math.round(diskon)), subtotal);

    const newOrder: Omit<Order, "id"> = {
      items: cart.map((item) => ({ ...item })),
      total: subtotal - diskonValid + ONGKIR,
      date: new Date().toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
      status: "Diproses",
    };

    try {
      const savedOrder = await createOrder(newOrder);

      setOrders((previous) => [
        savedOrder,
        ...previous.filter(
          (order) => String(order.id) !== String(savedOrder.id),
        ),
      ]);

      setCart([]);
      setActivePage("Riwayat Pesanan");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Kesalahan tidak diketahui";

      window.alert(`Checkout gagal disimpan ke server.\nDetail: ${message}`);
    }
  }

  async function handleUpdateOrderStatus(
    orderId: string,
    status: Order["status"],
  ) {
    try {
      const updatedOrder = await updateOrderStatus(orderId, status);

      setOrders((previous) =>
        previous.map((order) =>
          String(order.id) === String(orderId) ? updatedOrder : order,
        ),
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Kesalahan tidak diketahui";

      window.alert(`Status pesanan gagal diperbarui.\nDetail: ${message}`);

      throw error;
    }
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Dashboard admin ditampilkan secara terpisah.
  if (activePage === "Dashboard Admin") {
    return (
      <AdminDashboard
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onExitAdmin={() => setActivePage("Beranda")}
        userList={userList}
        setUserList={setUserList}
        showUserForm={showUserForm}
        setShowUserForm={setShowUserForm}
        editingUser={editingUser}
        setEditingUser={setEditingUser}
        viewUser={viewUser}
        setViewUser={setViewUser}
        userForm={userForm}
        setUserForm={setUserForm}
      />
    );
  }

  function renderPage() {
    if (activePage === "Dashboard") {
      return (
        <UserDashboard
          orders={orders}
          favorites={favorites}
          onNavigate={setActivePage}
        />
      );
    }
    switch (activePage) {
      case "Beranda":
        return (
          <Beranda
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onAddToCart={handleAddToCart}
            onNavigateToCatalog={() => setActivePage("Katalog")}
          />
        );

      case "Katalog":
        return (
          <Katalog
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onAddToCart={handleAddToCart}
          />
        );

      case "Favorit":
        return (
          <Favorit
            foods={foods}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onAddToCart={handleAddToCart}
            onNavigateToCatalog={() => setActivePage("Katalog")}
          />
        );

      case "Keranjang":
        return (
          <Keranjang
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onCheckout={handleCheckout}
            onNavigateToCatalog={() => setActivePage("Katalog")}
          />
        );

      case "Riwayat Pesanan":
        return (
          <RiwayatPesanan
            orders={orders}
            onNavigateToCatalog={() => setActivePage("Katalog")}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        );

      case "Profil Saya":
        return (
          <ProfilSaya
            cart={cart}
            favorites={favorites}
            orders={orders}
            onNavigate={setActivePage}
          />
        );

      default:
        return null;
    }
  }

  const mobileNavigation = [
    {
      label: "Dashboard",
      shortLabel: "Dashboard",
      icon: "⌂",
    },
    { label: "Beranda", shortLabel: "Beranda", icon: "⌂" },
    { label: "Katalog", shortLabel: "Katalog", icon: "▦" },
    { label: "Favorit", shortLabel: "Favorit", icon: "♡" },
    { label: "Keranjang", shortLabel: "Keranjang", icon: "🛒" },
    {
      label: "Riwayat Pesanan",
      shortLabel: "Riwayat",
      icon: "◷",
    },
    { label: "Profil Saya", shortLabel: "Profil", icon: "♙" },
    {
      label: "Dashboard Admin",
      shortLabel: "Admin",
      icon: "▤",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f5f0] text-[#34261f]">
      <div className="flex min-h-screen">
        <Sidebar activePage={activePage} onNavigate={setActivePage} />

        <main className="min-w-0 w-full flex-1 px-3 py-4 pb-28 sm:px-6 sm:py-6 lg:px-9 lg:py-8 lg:pb-8">
          <header className="mb-6 flex items-start justify-between gap-3 sm:mb-8 sm:items-center sm:gap-4">
            <div>
              <p className="text-[10px] font-bold tracking-[0.14em] text-[#a85d3b] sm:text-xs sm:tracking-[0.18em]">
                KULINERAN MANTAP
              </p>

              <h1 className="mt-1 text-2xl font-extrabold sm:mt-2 sm:text-3xl">
                {activePage}
              </h1>

              <p className="mt-1 max-w-[260px] text-xs leading-5 text-[#8c8177] sm:mt-2 sm:max-w-none sm:text-sm">
                {pageDescriptions[activePage]}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActivePage("Keranjang")}
              aria-label="Buka keranjang"
              className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#e9e1d7] bg-white text-xl transition hover:border-[#a85d3b]"
            >
              🛒
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-[#a0522d] px-1 text-xs font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>
          </header>

          {renderPage()}

          <footer className="mt-10 border-t border-[#e9e1d7] py-5 text-center text-xs text-[#a59a8c]">
            © 2026 Kulineran Mantap
          </footer>
        </main>
      </div>

      <nav
        aria-label="Navigasi utama mobile"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-8 border-t border-[#e9e1d7] bg-white/95 px-1 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-4px_16px_rgba(52,38,31,0.06)] backdrop-blur lg:hidden"
      >
        {mobileNavigation.map((item) => {
          const isActive = activePage === item.label;

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => setActivePage(item.label)}
              aria-current={isActive ? "page" : undefined}
              className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-lg px-0.5 py-1 text-[10px] font-semibold leading-tight transition sm:text-xs ${
                isActive
                  ? "text-[#a85d3b]"
                  : "text-[#a59a8c] hover:text-[#8c492e]"
              }`}
            >
              <span className="text-lg leading-5 sm:text-xl" aria-hidden="true">
                {item.icon}
              </span>

              <span className="max-w-full truncate">{item.shortLabel}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export default App;
