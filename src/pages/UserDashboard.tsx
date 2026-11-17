import type { Order } from "../types/food";
import { foods, formatRupiah } from "../data/foods";

type UserDashboardProps = {
  orders: Order[];
  favorites: number[];
  onNavigate: (page: string) => void;
};

const statusStyles: Record<Order["status"], string> = {
  Diproses: "bg-amber-100 text-amber-700",
  "Sedang diantar": "bg-sky-100 text-sky-700",
  Selesai: "bg-emerald-100 text-emerald-700",
  Dibatalkan: "bg-rose-100 text-rose-700",
};

function formatDate(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString || "-";
  }

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function MetricCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-[#eee5da] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f7e9dc] text-xl text-[#a85d3b]">
          {icon}
        </div>
        <span className="text-xs font-semibold text-[#b3a497]">
          Kulineran Mantap
        </span>
      </div>

      <p className="mt-5 text-sm font-medium text-[#8c8177]">{title}</p>
      <p className="mt-1 text-2xl font-extrabold text-[#34261f]">{value}</p>
      <p className="mt-2 text-xs text-[#a59a8c]">{description}</p>
    </div>
  );
}

export default function UserDashboard({
  orders,
  favorites,
  onNavigate,
}: UserDashboardProps) {
  const activeOrders = orders.filter(
    (order) => order.status === "Diproses" || order.status === "Sedang diantar",
  );

  const completedOrders = orders.filter((order) => order.status === "Selesai");

  const totalSpending = completedOrders.reduce(
    (total, order) => total + order.total,
    0,
  );

  const recentOrders = [...orders]
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();

      return (
        (Number.isNaN(dateB) ? 0 : dateB) - (Number.isNaN(dateA) ? 0 : dateA)
      );
    })
    .slice(0, 4);

  const favoriteFoods = foods
    .filter((food) => favorites.includes(food.id))
    .slice(0, 3);

  const recommendedFoods = [...foods]
    .filter((food) => food.popular)
    .slice(0, 3);

  return (
    <div className="space-y-7 pb-10">
      {/* WELCOME SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-[#30231d] p-6 text-white shadow-sm sm:p-9 lg:p-10">
        <div className="absolute -right-12 -top-16 h-64 w-64 rounded-full bg-[#a85d3b]/30 blur-3xl" />
        <div className="absolute -bottom-20 right-1/3 h-48 w-48 rounded-full bg-[#e6a477]/10 blur-3xl" />

        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex rounded-full border border-[#e6a477]/30 bg-[#a85d3b]/20 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#f0b58e]">
            Customer Dashboard
          </span>

          <h2 className="mt-5 text-3xl font-black leading-tight sm:text-4xl">
            Selamat datang kembali!
          </h2>

          <p className="mt-3 max-w-lg text-sm leading-6 text-white/65 sm:text-base">
            Saatnya menikmati hidangan favorit. Temukan menu pilihan dan pesan
            makanan dengan mudah melalui Kulineran Mantap.
          </p>

          <button
            type="button"
            onClick={() => onNavigate("Katalog")}
            className="mt-6 rounded-xl bg-[#e6a477] px-5 py-3 text-sm font-bold text-[#30231d] transition hover:bg-[#f0b58e] active:scale-95"
          >
            Jelajahi Menu <span aria-hidden="true">→</span>
          </button>
        </div>

        <div className="pointer-events-none absolute bottom-5 right-7 hidden text-8xl opacity-20 lg:block">
          🍱
        </div>
      </section>

      {/* STATISTIK */}
      <section>
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a85d3b]">
            Ringkasan aktivitas
          </p>
          <h2 className="mt-1 text-xl font-extrabold text-[#34261f]">
            Aktivitas akunmu
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Total Pesanan"
            value={orders.length}
            description="Seluruh pesanan tercatat"
            icon="▤"
          />

          <MetricCard
            title="Pesanan Aktif"
            value={activeOrders.length}
            description="Sedang diproses atau diantar"
            icon="◷"
          />

          <MetricCard
            title="Pesanan Selesai"
            value={completedOrders.length}
            description="Pesanan yang telah selesai"
            icon="✓"
          />

          <MetricCard
            title="Menu Favorit"
            value={favorites.length}
            description="Makanan yang kamu simpan"
            icon="♡"
          />
        </div>
      </section>

      {/* PENGELUARAN DAN PESANAN AKTIF */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col justify-between rounded-2xl border border-[#e8c5a9] bg-gradient-to-br from-[#f7e5d4] to-[#fff8f0] p-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a85d3b]">
              Ringkasan transaksi
            </p>

            <h2 className="mt-3 text-sm font-medium text-[#78675a]">
              Total pengeluaran
            </h2>

            <p className="mt-1 break-words text-3xl font-black text-[#34261f]">
              {formatRupiah(totalSpending)}
            </p>

            <p className="mt-2 text-xs leading-5 text-[#8c8177]">
              Dihitung dari seluruh pesanan dengan status selesai.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate("Riwayat Pesanan")}
            className="mt-6 w-fit rounded-xl border border-[#d9b69d] bg-white/70 px-4 py-2.5 text-sm font-bold text-[#8c492e] transition hover:bg-white"
          >
            Lihat Riwayat Pesanan →
          </button>
        </div>

        <div className="rounded-2xl border border-[#eee5da] bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a85d3b]">
                Sedang berjalan
              </p>
              <h2 className="mt-1 text-lg font-extrabold text-[#34261f]">
                Pesanan Aktif
              </h2>
            </div>

            <span className="rounded-full bg-[#f7e9dc] px-3 py-1 text-xs font-bold text-[#8c492e]">
              {activeOrders.length} pesanan
            </span>
          </div>

          {activeOrders.length > 0 ? (
            <div className="mt-5 space-y-3">
              {activeOrders.slice(0, 2).map((order) => (
                <div
                  key={order.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#f0e8df] bg-[#fffdfb] p-4"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-[#34261f]">
                      Pesanan #{order.id}
                    </p>
                    <p className="mt-1 text-xs text-[#9a8d80]">
                      {order.items.reduce(
                        (total, item) => total + item.quantity,
                        0,
                      )}{" "}
                      item · {formatDate(order.date)}
                    </p>
                    <p className="mt-2 text-sm font-bold text-[#a85d3b]">
                      {formatRupiah(order.total)}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                      statusStyles[order.status]
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              ))}

              <button
                type="button"
                onClick={() => onNavigate("Riwayat Pesanan")}
                className="mt-1 text-sm font-bold text-[#a85d3b] transition hover:text-[#8c492e]"
              >
                Lihat semua pesanan →
              </button>
            </div>
          ) : (
            <div className="mt-5 rounded-xl bg-[#faf7f3] px-4 py-8 text-center">
              <p className="text-3xl">🛍️</p>
              <p className="mt-3 font-bold text-[#34261f]">
                Belum ada pesanan aktif
              </p>
              <p className="mt-1 text-sm text-[#8c8177]">
                Pesanan yang sedang diproses akan muncul di sini.
              </p>
              <button
                type="button"
                onClick={() => onNavigate("Katalog")}
                className="mt-4 rounded-lg bg-[#a85d3b] px-4 py-2 text-sm font-bold text-white hover:bg-[#8c492e]"
              >
                Cari Makanan
              </button>
            </div>
          )}
        </div>
      </section>

      {/* RIWAYAT PESANAN */}
      <section className="overflow-hidden rounded-2xl border border-[#eee5da] bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f0e8df] p-5 sm:p-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a85d3b]">
              Aktivitas terbaru
            </p>
            <h2 className="mt-1 text-lg font-extrabold text-[#34261f]">
              Pesanan Terakhir
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onNavigate("Riwayat Pesanan")}
            className="text-sm font-bold text-[#a85d3b] hover:text-[#8c492e]"
          >
            Lihat semua →
          </button>
        </div>

        {recentOrders.length > 0 ? (
          <div className="divide-y divide-[#f3ede6]">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 transition hover:bg-[#fffdfb] sm:px-6"
              >
                <div className="min-w-0">
                  <p className="font-bold text-[#34261f]">
                    Pesanan #{order.id}
                  </p>
                  <p className="mt-1 text-xs text-[#9a8d80]">
                    {order.items.reduce(
                      (total, item) => total + item.quantity,
                      0,
                    )}{" "}
                    item · {formatDate(order.date)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <p className="text-sm font-bold text-[#34261f]">
                    {formatRupiah(order.total)}
                  </p>
                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                      statusStyles[order.status]
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-5 py-10 text-center">
            <p className="text-3xl">📋</p>
            <p className="mt-3 font-bold text-[#34261f]">
              Belum ada riwayat pesanan
            </p>
            <p className="mt-1 text-sm text-[#8c8177]">
              Pesanan yang kamu buat akan tercatat di bagian ini.
            </p>
          </div>
        )}
      </section>

      {/* MENU FAVORIT */}
      <section>
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a85d3b]">
              Koleksi pribadimu
            </p>
            <h2 className="mt-1 text-xl font-extrabold text-[#34261f]">
              Menu Favorit
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onNavigate("Favorit")}
            className="text-sm font-bold text-[#a85d3b] hover:text-[#8c492e]"
          >
            Lihat semua →
          </button>
        </div>

        {favoriteFoods.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {favoriteFoods.map((food) => (
              <div
                key={food.id}
                className="overflow-hidden rounded-2xl border border-[#eee5da] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <img
                  src={food.image}
                  alt={food.name}
                  className="h-40 w-full object-cover"
                  loading="lazy"
                />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-bold text-[#34261f]">
                        {food.name}
                      </p>
                      <p className="mt-1 text-xs text-[#9a8d80]">
                        {food.category}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-bold text-[#a85d3b]">
                      ★ {food.rating}
                    </span>
                  </div>
                  <p className="mt-3 font-extrabold text-[#34261f]">
                    {formatRupiah(food.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#dfd2c5] bg-white p-7 text-center">
            <p className="text-3xl">♡</p>
            <p className="mt-2 font-bold text-[#34261f]">
              Belum ada menu favorit
            </p>
            <p className="mt-1 text-sm text-[#8c8177]">
              Simpan makanan yang kamu sukai agar mudah ditemukan.
            </p>
            <button
              type="button"
              onClick={() => onNavigate("Katalog")}
              className="mt-4 rounded-xl bg-[#a85d3b] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#8c492e]"
            >
              Jelajahi Menu
            </button>
          </div>
        )}
      </section>

      {/* REKOMENDASI MENU */}
      <section>
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a85d3b]">
            Pilihan pelanggan
          </p>
          <h2 className="mt-1 text-xl font-extrabold text-[#34261f]">
            Rekomendasi Untukmu
          </h2>
          <p className="mt-1 text-sm text-[#8c8177]">
            Beberapa menu populer yang layak masuk daftar pesananmu.
          </p>
        </div>

        {recommendedFoods.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {recommendedFoods.map((food) => (
              <button
                key={food.id}
                type="button"
                onClick={() => onNavigate("Katalog")}
                className="group overflow-hidden rounded-2xl border border-[#eee5da] bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={food.image}
                    alt={food.name}
                    className="h-44 w-full object-cover transition duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-[#a85d3b] px-3 py-1 text-xs font-bold text-white">
                    Populer
                  </span>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="truncate font-bold text-[#34261f]">
                      {food.name}
                    </h3>
                    <span className="shrink-0 text-xs font-bold text-[#a85d3b]">
                      ★ {food.rating}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[#9a8d80]">{food.category}</p>
                  <p className="mt-3 font-extrabold text-[#34261f]">
                    {formatRupiah(food.price)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-[#eee5da] bg-white p-6 text-center">
            <p className="font-bold text-[#34261f]">
              Belum ada rekomendasi menu.
            </p>
            <p className="mt-1 text-sm text-[#8c8177]">
              Menu populer akan muncul di sini.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
