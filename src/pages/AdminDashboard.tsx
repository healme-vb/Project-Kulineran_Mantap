import { useMemo, useState, useEffect } from "react";
import type React from "react";
import type { Order } from "../types/food";
import type { UserData } from "../types/user";
import { foods } from "../data/foods";

type OrderStatus = Order["status"];

type DashboardItem = {
  food?: {
    id?: number;
    name?: string;
    price?: number;
  };
  quantity?: number;
  total?: number;
};

type DashboardOrder = {
  id: string | number;
  status: OrderStatus;
  total: number;
  date?: string;
  createdAt?: string;
  items?: DashboardItem[];
};

interface PaginationData {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

type Props = {
  orders: Order[];
  onUpdateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  onExitAdmin: () => void;

  userList: UserData[];
  setUserList: React.Dispatch<React.SetStateAction<UserData[]>>;

  showUserForm: boolean;
  setShowUserForm: React.Dispatch<React.SetStateAction<boolean>>;

  editingUser: number | null;
  setEditingUser: React.Dispatch<React.SetStateAction<number | null>>;

  viewUser: UserData | null;
  setViewUser: React.Dispatch<React.SetStateAction<UserData | null>>;

  userForm: {
    name: string;
    email: string;
    password?: string;
    role: UserData["role"];
  };
  setUserForm: React.Dispatch<
    React.SetStateAction<{
      name: string;
      email: string;
      password?: string;
      role: UserData["role"];
    }>
  >;
};

const statuses: OrderStatus[] = [
  "Diproses",
  "Sedang diantar",
  "Selesai",
  "Dibatalkan",
];

const money = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0);

const statusStyle: Record<string, string> = {
  Diproses: "bg-amber-100 text-amber-700",
  "Sedang diantar": "bg-sky-100 text-sky-700",
  Selesai: "bg-emerald-100 text-emerald-700",
  Dibatalkan: "bg-rose-100 text-rose-700",
};

function dateOf(order: DashboardOrder): Date | null {
  const value = order.createdAt || order.date;

  if (!value) return null;

  const parsed = new Date(value);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function Metric({
  title,
  value,
  description,
  icon,
  color,
}: {
  title: string;
  value: string;
  description: string;
  icon: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-[#eee4d9] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold ${color}`}
      >
        {icon}
      </div>

      <p className="mt-5 text-sm font-medium text-[#8c8177]">{title}</p>

      <p className="mt-1 break-words text-2xl font-extrabold text-[#34261f]">
        {value}
      </p>

      <p className="mt-2 text-xs text-[#a59a8c]">{description}</p>
    </div>
  );
}

function Empty({ title, description }: { title: string; description: string }) {
  return (
    <div className="px-6 py-12 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#f8f1e9] text-2xl text-[#a85d3b]">
        ▤
      </div>

      <h3 className="mt-3 font-bold text-[#34261f]">{title}</h3>

      <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-[#8c8177]">
        {description}
      </p>
    </div>
  );
}

export default function AdminDashboard({
  orders,
  onUpdateOrderStatus,
  onExitAdmin,
  showUserForm,
  setShowUserForm,
  editingUser,
  setEditingUser,
  viewUser,
  setViewUser,
  userForm,
  setUserForm,
}: Props) {
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [period, setPeriod] = useState<6 | 12>(6);
  const [orderFilter, setOrderFilter] = useState("Semua");
  const [userSearch, setUserSearch] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const [backendUsers, setBackendUsers] = useState<any[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(false);

  const dashboardOrders = orders as unknown as DashboardOrder[];
  const validOrders = dashboardOrders.filter(
    (order) => order.status !== "Dibatalkan",
  );
  const revenue = validOrders.reduce(
    (sum, order) => sum + (Number(order.total) || 0),
    0,
  );
  const pending = dashboardOrders.filter(
    (order) => order.status === "Diproses",
  ).length;
  const completed = dashboardOrders.filter(
    (order) => order.status === "Selesai",
  ).length;

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/users?page=${currentPage}&limit=5`,
      );
      const result = await response.json();

      if (result.success) {
        setBackendUsers(result.data);
        setPagination(result.pagination);
      }
    } catch (error) {
      console.error("Gagal mengambil data pengguna:", error);
      setMessage("Gagal mengambil data dari server.");
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (activeSection === "Pengguna") {
      fetchUsers();
    }
  }, [activeSection, currentPage]);

  const chart = useMemo(() => {
    const now = new Date();

    const rows = Array.from({ length: period }, (_, index) => {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - period + index + 1,
        1,
      );

      return {
        key: `${date.getFullYear()}-${date.getMonth()}`,
        label: date.toLocaleDateString("id-ID", {
          month: "short",
        }),
        amount: 0,
      };
    });

    const monthMap = new Map(rows.map((row) => [row.key, row]));

    validOrders.forEach((order) => {
      const date = dateOf(order);
      if (!date) return;
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const row = monthMap.get(key);
      if (row) {
        row.amount += Number(order.total) || 0;
      }
    });
    return rows;
  }, [orders, period]);

  const maxChart = Math.max(1, ...chart.map((row) => row.amount));

  const topProducts = useMemo(() => {
    const productMap = new Map<
      string,
      {
        id: string;
        name: string;
        quantity: number;
        revenue: number;
      }
    >();

    validOrders.forEach((order) => {
      (order.items ?? []).forEach((item) => {
        const food = item.food;
        if (!food) return;

        const id = String(food.id ?? food.name ?? "unknown");
        const quantity = Number(item.quantity) || 0;

        const product = productMap.get(id) ?? {
          id,
          name: food.name ?? "Menu makanan",
          quantity: 0,
          revenue: 0,
        };

        product.quantity += quantity;
        product.revenue +=
          Number(item.total) || (Number(food.price) || 0) * quantity;

        productMap.set(id, product);
      });
    });

    return [...productMap.values()]
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [orders]);

  const shownOrders = dashboardOrders
    .filter((order) => orderFilter === "Semua" || order.status === orderFilter)
    .slice(0, 10);

  const filteredUsers = backendUsers.filter((user) => {
    const search = userSearch.toLowerCase();
    const role = user.role || "Pelanggan";
    return (
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      role.toLowerCase().includes(search)
    );
  });

  const totalCustomers = pagination?.totalItems || 0;
  const totalAdmins = 0;

  function navigate(section: string) {
    setActiveSection(section);

    const targetMap: Record<string, string> = {
      Dashboard: "admin-dashboard-content",
      Pesanan: "admin-orders",
      Pengguna: "admin-users",
      Laporan: "admin-revenue",
      "Menu Makanan": "admin-menu",
    };

    document.getElementById(targetMap[section])?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  async function handleSubmitUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const url = editingUser
      ? `http://localhost:3000/api/v1/users/${editingUser}`
      : `http://localhost:3000/api/v1/users/register`;

    // Ubah dari "PUT" menjadi "PATCH" agar cocok dengan backend
    const method = editingUser ? "PATCH" : "POST";

    const payload: any = {
      name: userForm.name,
      email: userForm.email,
      role: userForm.role,
    };

    if (userForm.password && userForm.password.trim() !== "") {
      payload.password = userForm.password;
    }

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success || response.ok) {
        setMessage(
          `Data pengguna berhasil ${editingUser ? "diperbarui" : "ditambahkan"}.`,
        );
        closeUserForm();
        fetchUsers();
      } else {
        setMessage(`Gagal: ${result.message || "Terjadi kesalahan"}`);
      }
    } catch (error) {
      setMessage("Terjadi kesalahan pada server saat menyimpan data.");
    }
  }
  function openAddUser() {
    setEditingUser(null);
    setUserForm({ name: "", email: "", password: "", role: "Pelanggan" });
    setShowUserForm(true);
    setViewUser(null);
  }

  function openEditUser(user: any) {
    setEditingUser(user.id);
    setUserForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role || "Pelanggan",
    });
    setShowUserForm(true);
    setViewUser(null);
  }

  function closeUserForm() {
    setShowUserForm(false);
    setEditingUser(null);
    setUserForm({ name: "", email: "", password: "", role: "Pelanggan" });
  }

  async function handleDeleteUser(user: any) {
    const confirmed = window.confirm(
      `Apakah yakin ingin menghapus ${user.name}?`,
    );
    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/users/${user.id}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        setMessage(`Pengguna ${user.name} berhasil dihapus.`);
        fetchUsers();
      } else {
        setMessage("Gagal menghapus pengguna dari server.");
      }
    } catch (error) {
      setMessage("Terjadi kesalahan koneksi saat menghapus data.");
    }
  }

  async function changeStatus(order: DashboardOrder, status: OrderStatus) {
    const id = String(order.id);
    setBusy(id);
    setMessage("");

    try {
      await onUpdateOrderStatus(id, status);
      setMessage(`Status pesanan #${id} berhasil diperbarui.`);
    } catch {
      setMessage(`Gagal memperbarui pesanan #${id}. Periksa koneksi backend.`);
    } finally {
      setBusy(null);
    }
  }

  const menuItems = [
    { label: "Dashboard", icon: "▦" },
    { label: "Pesanan", icon: "▤" },
    { label: "Pengguna", icon: "♙" },
    { label: "Laporan", icon: "▥" },
    { label: "Menu Makanan", icon: "♨" },
  ];

  return (
    <div className="min-h-screen bg-[#f8f5f0] text-[#34261f] lg:flex">
      {/* SIDEBAR */}
      <aside className="flex w-full shrink-0 flex-col border-b border-[#e9e1d7] bg-white p-4 lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:border-b-0 lg:border-r lg:p-5">
        <button
          type="button"
          onClick={() => navigate("Dashboard")}
          className="flex items-center gap-3 text-left"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#a85d3b] text-2xl font-bold text-white">
            K
          </span>

          <span>
            <span className="block text-lg font-extrabold">Kulineran</span>
            <span className="block text-xs font-bold tracking-widest text-[#a85d3b]">
              MANTAP ADMIN
            </span>
          </span>
        </button>

        <p className="mb-3 mt-8 hidden px-3 text-xs font-bold uppercase tracking-widest text-[#a59a8c] lg:block">
          Menu utama
        </p>

        <nav
          aria-label="Navigasi admin"
          className="mt-5 flex gap-2 overflow-x-auto lg:mt-0 lg:flex-col"
        >
          {menuItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => navigate(item.label)}
              className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                activeSection === item.label
                  ? "bg-[#f4dfcb] text-[#8c492e]"
                  : "text-[#8c8177] hover:bg-[#faf5ef] hover:text-[#34261f]"
              }`}
            >
              <span className="w-5 text-center text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto hidden rounded-2xl bg-[#f8f1e9] p-4 lg:block">
          <p className="font-bold">Panel Admin</p>
          <p className="mt-2 text-xs leading-5 text-[#8c8177]">
            Kelola pesanan, pengguna, dan operasional Kulineran Mantap.
          </p>
          <button
            type="button"
            onClick={onExitAdmin}
            className="mt-4 w-full rounded-xl bg-[#a85d3b] py-2.5 text-sm font-bold text-white transition hover:bg-[#8c492e]"
          >
            Kembali ke toko
          </button>
        </div>

        <button
          type="button"
          onClick={onExitAdmin}
          className="mt-3 rounded-xl border border-[#e9e1d7] px-3 py-2 text-sm font-bold text-[#8c8177] lg:hidden"
        >
          Kembali ke toko
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="min-w-0 flex-1 px-3 py-5 sm:px-6 lg:px-8 lg:py-8">
        <div className="mx-auto w-full max-w-[1600px] space-y-6">
          {/* HEADER */}
          <header
            id="admin-dashboard-content"
            className="scroll-mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
          >
            <div>
              <p className="text-sm text-[#8c8177]">
                Ringkasan operasional toko
              </p>
              <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">
                {activeSection === "Dashboard"
                  ? "Dashboard Admin"
                  : activeSection}
              </h1>
              <p className="mt-2 text-sm text-[#8c8177]">
                Selamat datang di panel admin Kulineran Mantap.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="rounded-xl border border-[#e9e1d7] bg-white px-4 py-2.5 text-sm font-bold hover:bg-[#faf5ef]"
              >
                Cetak laporan
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded-xl bg-[#a85d3b] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#8c492e]"
              >
                Muat ulang
              </button>
            </div>
          </header>

          {message && (
            <div
              role="status"
              className="flex items-center justify-between gap-3 rounded-xl border border-[#e9e1d7] bg-white p-3 text-sm"
            >
              <span>{message}</span>
              <button
                type="button"
                onClick={() => setMessage("")}
                className="font-bold text-[#a85d3b]"
                aria-label="Tutup pesan"
              >
                ×
              </button>
            </div>
          )}

          {/* STATISTIK */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
            <Metric
              title="Total Pesanan"
              value={String(dashboardOrders.length)}
              description="Semua pesanan tercatat"
              icon="▣"
              color="bg-blue-50 text-blue-600"
            />
            <Metric
              title="Total Pendapatan"
              value={money(revenue)}
              description="Tidak termasuk pesanan batal"
              icon="↗"
              color="bg-emerald-50 text-emerald-600"
            />
            <Metric
              title="Perlu Diproses"
              value={String(pending)}
              description="Menunggu tindakan admin"
              icon="◷"
              color="bg-amber-50 text-amber-700"
            />
            <Metric
              title="Pesanan Selesai"
              value={String(completed)}
              description="Pesanan telah dituntaskan"
              icon="✓"
              color="bg-cyan-50 text-cyan-700"
            />
          </section>

          {/* STATISTIK PENGGUNA */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Metric
              title="Total Pengguna"
              value={String(totalCustomers)}
              description="Seluruh akun terdaftar"
              icon="♙"
              color="bg-purple-50 text-purple-600"
            />
            <Metric
              title="Pelanggan"
              value={String(totalCustomers)}
              description="Akun pelanggan"
              icon="♧"
              color="bg-orange-50 text-orange-600"
            />
            <Metric
              title="Admin"
              value={String(totalAdmins)}
              description="Akun administrator"
              icon="⚙"
              color="bg-slate-100 text-slate-600"
            />
          </section>

          {/* LAPORAN DAN GRAFIK */}
          <section
            id="admin-revenue"
            className="scroll-mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,1fr)]"
          >
            <div className="rounded-2xl border border-[#e9e1d7] bg-white p-4 shadow-sm sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-extrabold">
                    Ringkasan Pendapatan
                  </h2>
                  <p className="mt-1 text-sm text-[#8c8177]">
                    Pendapatan per bulan berdasarkan tanggal pesanan.
                  </p>
                </div>
                <div className="flex rounded-xl bg-[#f8f5f0] p-1">
                  {([6, 12] as const).map((month) => (
                    <button
                      key={month}
                      type="button"
                      onClick={() => setPeriod(month)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
                        period === month
                          ? "bg-[#a85d3b] text-white"
                          : "text-[#8c8177]"
                      }`}
                    >
                      {month} bulan
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-7 flex h-56 items-end gap-2 border-b border-l border-[#e9e1d7] px-2 pt-3 sm:h-64 sm:gap-3 sm:px-4">
                {chart.map((row) => (
                  <div
                    key={row.key}
                    className="group flex h-full min-w-0 flex-1 flex-col justify-end"
                  >
                    <span className="mb-2 truncate text-center text-[10px] text-[#8c8177] opacity-0 group-hover:opacity-100">
                      {money(row.amount)}
                    </span>
                    <div
                      title={`${row.label}: ${money(row.amount)}`}
                      className="w-full rounded-t-md bg-gradient-to-t from-[#8c492e] to-[#d99b72]"
                      style={{
                        height: `${row.amount ? Math.max(8, (row.amount / maxChart) * 100) : 3}%`,
                      }}
                    />
                    <span className="mt-2 -mb-6 text-center text-[10px] text-[#8c8177] sm:text-xs">
                      {row.label}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-9 text-xs text-[#8c8177]">
                {dashboardOrders.length} pesanan tercatat.
              </p>
            </div>

            {/* MENU TERLARIS */}
            <div className="rounded-2xl border border-[#e9e1d7] bg-white p-4 shadow-sm sm:p-6">
              <h2 className="text-lg font-extrabold">Menu Terlaris</h2>
              <p className="mt-1 text-sm text-[#8c8177]">
                Berdasarkan jumlah menu yang terjual.
              </p>
              {topProducts.length > 0 ? (
                <div className="mt-5 space-y-5">
                  {topProducts.map((product, index) => (
                    <div key={product.id}>
                      <div className="mb-2 flex items-center justify-between gap-2 text-sm">
                        <span className="truncate font-semibold">
                          <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-md bg-[#f8f1e9] text-xs text-[#a85d3b]">
                            {index + 1}
                          </span>
                          {product.name}
                        </span>
                        <span className="shrink-0 text-xs text-[#8c8177]">
                          {product.quantity} terjual
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[#f1ebe4]">
                        <div
                          className="h-full rounded-full bg-[#a85d3b]"
                          style={{
                            width: `${(product.quantity / Math.max(...topProducts.map((item) => item.quantity), 1)) * 100}%`,
                          }}
                        />
                      </div>
                      <p className="mt-1 text-right text-xs text-[#8c8177]">
                        {money(product.revenue)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <Empty
                  title="Belum ada data penjualan"
                  description="Menu terlaris akan tampil setelah ada pesanan."
                />
              )}
            </div>
          </section>

          {/* KELOLA PESANAN */}
          <section
            id="admin-orders"
            className="scroll-mt-6 overflow-hidden rounded-2xl border border-[#e9e1d7] bg-white shadow-sm"
          >
            <div className="flex flex-col justify-between gap-3 border-b border-[#e9e1d7] p-4 sm:flex-row sm:items-center sm:p-6">
              <div>
                <h2 className="text-lg font-extrabold">Pesanan Terbaru</h2>
                <p className="mt-1 text-sm text-[#8c8177]">
                  Kelola dan perbarui status pesanan pelanggan.
                </p>
              </div>
              <select
                value={orderFilter}
                onChange={(event) => setOrderFilter(event.target.value)}
                className="rounded-xl border border-[#e9e1d7] bg-white px-3 py-2.5 text-sm"
                aria-label="Filter status pesanan"
              >
                <option value="Semua">Semua status</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {!shownOrders.length ? (
              <Empty
                title="Belum ada pesanan"
                description="Pesanan akan tampil setelah pelanggan melakukan checkout."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[780px] text-left text-sm">
                  <thead className="bg-[#faf7f2] text-xs uppercase tracking-wide text-[#8c8177]">
                    <tr>
                      {[
                        "ID Pesanan",
                        "Produk",
                        "Tanggal",
                        "Total",
                        "Status",
                        "Aksi Admin",
                      ].map((heading) => (
                        <th key={heading} className="px-5 py-4 font-bold">
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1ebe4]">
                    {shownOrders.map((order) => {
                      const date = dateOf(order);
                      const items = order.items ?? [];
                      const first = items[0];
                      const product =
                        items.length > 1
                          ? `${first?.food?.name ?? "Menu"} + ${items.length - 1} menu`
                          : (first?.food?.name ?? "Pesanan");
                      const id = String(order.id);

                      return (
                        <tr key={id} className="hover:bg-[#fdfaf6]">
                          <td className="px-5 py-4 font-extrabold text-[#a85d3b]">
                            #{id}
                          </td>
                          <td className="px-5 py-4">
                            <p className="font-semibold">{product}</p>
                            <p className="mt-1 text-xs text-[#8c8177]">
                              {items.reduce(
                                (sum, item) =>
                                  sum + (Number(item.quantity) || 0),
                                0,
                              )}{" "}
                              item
                            </p>
                          </td>
                          <td className="px-5 py-4 text-[#8c8177]">
                            {date
                              ? date.toLocaleString("id-ID", {
                                  dateStyle: "medium",
                                  timeStyle: "short",
                                })
                              : (order.date ?? "-")}
                          </td>
                          <td className="px-5 py-4 font-bold">
                            {money(Number(order.total) || 0)}
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ${statusStyle[order.status] ?? "bg-slate-100 text-slate-600"}`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <select
                              value={order.status}
                              disabled={busy === id}
                              onChange={(event) =>
                                void changeStatus(
                                  order,
                                  event.target.value as OrderStatus,
                                )
                              }
                              className="max-w-40 rounded-lg border border-[#e9e1d7] bg-white px-2 py-2 text-xs disabled:opacity-50"
                              aria-label={`Status pesanan ${id}`}
                            >
                              {statuses.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* KELOLA PENGGUNA */}
          <section
            id="admin-users"
            className="scroll-mt-6 overflow-hidden rounded-2xl border border-[#e9e1d7] bg-white shadow-sm"
          >
            <div className="flex flex-col justify-between gap-4 border-b border-[#e9e1d7] p-4 sm:flex-row sm:items-center sm:p-6">
              <div>
                <h2 className="text-lg font-extrabold">Manajemen Pengguna</h2>
                <p className="mt-1 text-sm text-[#8c8177]">
                  Tambah, lihat, ubah, dan hapus data pengguna.
                </p>
              </div>
              <button
                type="button"
                onClick={openAddUser}
                className="rounded-xl bg-[#a85d3b] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#8c492e]"
              >
                + Tambah Pengguna
              </button>
            </div>

            <div className="border-b border-[#e9e1d7] p-4 sm:p-5">
              <input
                type="search"
                value={userSearch}
                onChange={(event) => setUserSearch(event.target.value)}
                placeholder="Cari nama, email..."
                className="w-full rounded-xl border border-[#e9e1d7] px-4 py-3 text-sm outline-none transition focus:border-[#a85d3b]"
              />
            </div>

            {isLoadingUsers ? (
              <div className="px-6 py-12 text-center text-[#8c8177]">
                Memuat data pengguna...
              </div>
            ) : filteredUsers.length === 0 ? (
              <Empty
                title="Pengguna tidak ditemukan"
                description="Coba gunakan kata kunci pencarian yang berbeda."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[750px] text-left text-sm">
                  <thead className="bg-[#faf7f2] text-xs uppercase tracking-wide text-[#8c8177]">
                    <tr>
                      {[
                        "Nama Pengguna",
                        "Email",
                        "Role",
                        "Tanggal Bergabung",
                        "Aksi",
                      ].map((heading) => (
                        <th key={heading} className="px-5 py-4 font-bold">
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1ebe4]">
                    {filteredUsers.map((user) => {
                      const joinDate = new Date(
                        user.createdAt,
                      ).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      });

                      const role = user.role || "Pelanggan";

                      return (
                        <tr key={user.id} className="hover:bg-[#fdfaf6]">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f4dfcb] font-bold text-[#8c492e]">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-bold">{user.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-[#8c8177]">
                            {user.email}
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-bold ${
                                role === "Admin"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {role}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-[#8c8177]">
                            {joinDate}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setViewUser({
                                    ...user,
                                    role,
                                    createdAt: joinDate,
                                  })
                                }
                                className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100"
                              >
                                Detail
                              </button>
                              <button
                                type="button"
                                onClick={() => openEditUser({ ...user, role })}
                                className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700 hover:bg-amber-100"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteUser({ ...user, role })
                                }
                                className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100"
                              >
                                Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {pagination && (
              <div className="flex items-center justify-between border-t border-[#e9e1d7] px-5 py-4">
                <div className="text-xs text-[#8c8177]">
                  Menampilkan Halaman {pagination.page} dari{" "}
                  {pagination.totalPages} ({pagination.totalItems} pengguna)
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={!pagination.hasPreviousPage}
                    className="rounded-lg border border-[#e9e1d7] bg-white px-3 py-1.5 text-xs font-bold text-[#34261f] hover:bg-[#faf5ef] disabled:opacity-50"
                  >
                    Sebelumnya
                  </button>
                  <button
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    disabled={!pagination.hasNextPage}
                    className="rounded-lg border border-[#e9e1d7] bg-white px-3 py-1.5 text-xs font-bold text-[#34261f] hover:bg-[#faf5ef] disabled:opacity-50"
                  >
                    Selanjutnya
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* KELOLA MENU MAKANAN */}
          <section
            id="admin-menu"
            className="scroll-mt-6 rounded-2xl border border-[#e9e1d7] bg-white p-4 shadow-sm sm:p-6"
          >
            <div>
              <h2 className="text-lg font-extrabold">Katalog Menu Makanan</h2>
              <p className="mt-1 text-sm text-[#8c8177]">
                Daftar menu yang saat ini tersedia di katalog frontend.
              </p>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {foods.map((food) => (
                <div
                  key={food.id}
                  className="overflow-hidden rounded-2xl border border-[#e9e1d7] bg-white"
                >
                  <img
                    src={food.image}
                    alt={food.name}
                    className="h-44 w-full object-cover"
                  />
                  <div className="p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#a85d3b]">
                      {food.category}
                    </p>
                    <h3 className="mt-1 font-extrabold">{food.name}</h3>
                    <p className="mt-2 text-sm text-[#8c8177]">
                      {food.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="font-extrabold text-[#a85d3b]">
                        {money(food.price)}
                      </span>
                      <span className="text-xs text-[#8c8177]">
                        Rating {food.rating}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-xl bg-[#f8f1e9] p-4 text-sm leading-6 text-[#8c8177]">
              Saat ini katalog masih membaca data dari
              <code className="mx-1 rounded bg-white px-1.5 py-0.5 text-[#8c492e]">
                data/foods.ts
              </code>
              . Fitur tambah, edit, dan hapus menu belum terhubung ke backend.
            </div>
          </section>

          <footer className="pb-4 text-center text-xs text-[#a59a8c]">
            © 2026 Kulineran Mantap Admin Dashboard
          </footer>
        </div>
      </main>

      {/* MODAL TAMBAH / EDIT PENGGUNA */}
      {showUserForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold">
                  {editingUser !== null ? "Edit Pengguna" : "Tambah Pengguna"}
                </h2>
                <p className="mt-1 text-sm text-[#8c8177]">
                  Lengkapi informasi pengguna.
                </p>
              </div>
              <button
                type="button"
                onClick={closeUserForm}
                className="text-2xl text-[#8c8177] hover:text-[#34261f]"
                aria-label="Tutup formulir"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmitUser} className="space-y-4">
              <div>
                <label
                  htmlFor="user-name"
                  className="mb-2 block text-sm font-semibold"
                >
                  Nama Lengkap
                </label>
                <input
                  id="user-name"
                  type="text"
                  value={userForm.name}
                  onChange={(event) =>
                    setUserForm((previous) => ({
                      ...previous,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Masukkan nama lengkap"
                  required
                  className="w-full rounded-xl border border-[#e9e1d7] px-4 py-3 text-sm outline-none focus:border-[#a85d3b]"
                />
              </div>

              <div>
                <label
                  htmlFor="user-email"
                  className="mb-2 block text-sm font-semibold"
                >
                  Email
                </label>
                <input
                  id="user-email"
                  type="email"
                  value={userForm.email}
                  onChange={(event) =>
                    setUserForm((previous) => ({
                      ...previous,
                      email: event.target.value,
                    }))
                  }
                  placeholder="contoh@email.com"
                  required
                  className="w-full rounded-xl border border-[#e9e1d7] px-4 py-3 text-sm outline-none focus:border-[#a85d3b]"
                />
              </div>

              {/* INPUT PASSWORD */}
              <div>
                <label
                  htmlFor="user-password"
                  className="mb-2 block text-sm font-semibold"
                >
                  Password
                </label>
                <input
                  id="user-password"
                  type="password"
                  value={userForm.password || ""}
                  onChange={(event) =>
                    setUserForm((previous) => ({
                      ...previous,
                      password: event.target.value,
                    }))
                  }
                  placeholder="Masukkan password"
                  required={editingUser === null}
                  className="w-full rounded-xl border border-[#e9e1d7] px-4 py-3 text-sm outline-none focus:border-[#a85d3b]"
                />
              </div>

              <div>
                <label
                  htmlFor="user-role"
                  className="mb-2 block text-sm font-semibold"
                >
                  Role Pengguna
                </label>
                <select
                  id="user-role"
                  value={userForm.role}
                  onChange={(event) =>
                    setUserForm((previous) => ({
                      ...previous,
                      role: event.target.value as UserData["role"],
                    }))
                  }
                  className="w-full rounded-xl border border-[#e9e1d7] bg-white px-4 py-3 text-sm outline-none focus:border-[#a85d3b]"
                >
                  <option value="Pelanggan">Pelanggan</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={closeUserForm}
                  className="flex-1 rounded-xl border border-[#e9e1d7] px-4 py-3 text-sm font-bold text-[#8c8177] hover:bg-[#faf5ef]"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    console.log("Tombol diklik, bro!"); // <-- Cek di Console F12 apakah teks ini muncul
                    handleSubmitUser(
                      e as unknown as React.FormEvent<HTMLFormElement>,
                    );
                  }}
                  className="flex-1 rounded-xl bg-[#a85d3b] px-4 py-3 text-sm font-bold text-white hover:bg-[#8c492e]"
                >
                  {editingUser !== null
                    ? "Simpan Perubahan"
                    : "Tambah Pengguna"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DETAIL PENGGUNA */}
      {viewUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-extrabold">Detail Pengguna</h2>
              <button
                type="button"
                onClick={() => setViewUser(null)}
                className="text-2xl text-[#8c8177]"
                aria-label="Tutup detail"
              >
                ×
              </button>
            </div>
            <div className="mb-5 flex flex-col items-center rounded-xl bg-[#faf5ef] p-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f4dfcb] text-2xl font-extrabold text-[#8c492e]">
                {viewUser.name.charAt(0).toUpperCase()}
              </div>
              <h3 className="mt-3 text-lg font-extrabold">{viewUser.name}</h3>
              <span className="mt-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                {viewUser.role}
              </span>
            </div>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-[#8c8177]">ID Pengguna</p>
                <p className="mt-1 font-bold">{viewUser.id}</p>
              </div>
              <div>
                <p className="text-[#8c8177]">Email</p>
                <p className="mt-1 break-all font-bold">{viewUser.email}</p>
              </div>
              <div>
                <p className="text-[#8c8177]">Tanggal Bergabung</p>
                <p className="mt-1 font-bold">{viewUser.createdAt}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setViewUser(null)}
              className="mt-6 w-full rounded-xl bg-[#a85d3b] py-3 text-sm font-bold text-white hover:bg-[#8c492e]"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
