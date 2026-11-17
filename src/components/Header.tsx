type HeaderProps = {
  activePage: string;
  search: string;
  cartCount: number;
  onSearchChange: (value: string) => void;
  onOpenCart: () => void;
};

const pageDescriptions: Record<string, string> = {
  Dashboard: "Pantau aktivitas dan pesanan kulineranmu.",
  Beranda: "Temukan makanan lezat untuk menemani harimu.",
  Katalog: "Jelajahi berbagai pilihan makanan favoritmu.",
  Favorit: "Kumpulan makanan yang kamu sukai.",
  Keranjang: "Periksa pesanan sebelum melanjutkan.",
  "Riwayat Pesanan": "Lihat daftar pesananmu sebelumnya.",
  "Profil Saya": "Kelola informasi akunmu.",
};

export default function Header({
  activePage,
  search,
  cartCount,
  onSearchChange,
  onOpenCart,
}: HeaderProps) {
  return (
    <header className="mb-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#9a8d80]">KULINERAN_MANTAP</p>

          <h1 className="mt-1 text-2xl font-extrabold text-[#34261f] sm:text-3xl">
            {activePage}
          </h1>

          <p className="mt-2 text-sm text-[#8c8177]">
            {pageDescriptions[activePage] ?? pageDescriptions.Beranda}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* TOMBOL KERANJANG */}
          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Buka keranjang, ${cartCount} item`}
            className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-[#e9e1d7] bg-white text-xl transition hover:border-[#a85d3b] hover:bg-[#fff8f0]"
          >
            🛒
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#a85d3b] px-1 text-xs font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>

          {/* PROFIL PENGGUNA */}
          <button
            type="button"
            className="flex h-12 items-center gap-3 rounded-xl border border-[#e9e1d7] bg-white px-3 transition hover:bg-[#fff8f0]"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f4dfcb] text-lg">
              👤
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-sm font-bold text-[#34261f]">Pengguna</p>
              <p className="text-xs text-[#9a8d80]">Member</p>
            </div>
          </button>
        </div>
      </div>

      {/* KOLOM PENCARIAN */}
      {["Beranda", "Katalog", "Favorit"].includes(activePage) && (
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-[#e9e1d7] bg-white px-4 py-3 transition focus-within:border-[#a85d3b] focus-within:ring-2 focus-within:ring-[#a85d3b]/10">
          <span className="text-xl text-[#a59a8c]">⌕</span>

          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Cari makanan favoritmu..."
            aria-label="Cari makanan"
            className="w-full bg-transparent text-sm text-[#34261f] outline-none placeholder:text-[#b2a79c]"
          />

          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Hapus pencarian"
              className="text-sm font-semibold text-[#a85d3b] hover:text-[#8c492e]"
            >
              Hapus
            </button>
          )}
        </div>
      )}
    </header>
  );
}
