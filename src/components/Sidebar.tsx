type SidebarProps = {
  activePage: string;
  onNavigate: (page: string) => void;
};

const menuItems = [
  { label: "Dashboard", icon: "▦" },
  { label: "Beranda", icon: "⌂" },
  { label: "Katalog", icon: "▦" },
  { label: "Favorit", icon: "♡" },
  { label: "Keranjang", icon: "🛒" },
  { label: "Riwayat Pesanan", icon: "◷" },
  { label: "Profil Saya", icon: "♙" },
];

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside className="hidden min-h-screen w-64 shrink-0 flex-col border-r border-[#e9e1d7] bg-[#fffaf3] p-5 lg:flex">
      {/* LOGO */}
      <button
        onClick={() => onNavigate("Dashboard")}
        className="mb-10 flex items-center gap-3 text-left"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#a85d3b] text-2xl text-white">
          ♨
        </div>

        <div>
          <h1 className="text-lg font-extrabold text-[#34261f]">Kulineran</h1>
          <p className="text-xs font-bold tracking-[0.2em] text-[#a85d3b]">
            MANTAP
          </p>
        </div>
      </button>

      {/* JUDUL MENU */}
      <p className="mb-4 px-3 text-xs font-bold uppercase tracking-widest text-[#a59a8c]">
        Menu Utama
      </p>

      {/* DAFTAR NAVIGASI */}
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => {
          const isActive = activePage === item.label;

          return (
            <button
              key={item.label}
              onClick={() => onNavigate(item.label)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                isActive
                  ? "bg-[#f4dfcb] text-[#8c492e]"
                  : "text-[#71665d] hover:bg-[#f7ede2] hover:text-[#8c492e]"
              }`}
            >
              <span className="flex w-6 justify-center text-xl">
                {item.icon}
              </span>

              <span>{item.label}</span>

              {isActive && (
                <span className="ml-auto h-2 w-2 rounded-full bg-[#a85d3b]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* KARTU PROMO */}
      <div className="mt-auto rounded-2xl bg-[#f4e6d5] p-4">
        <div className="mb-3 text-2xl">🍜</div>

        <h3 className="font-bold text-[#34261f]">Lagi lapar?</h3>

        <p className="mt-2 text-xs leading-5 text-[#817267]">
          Temukan makanan favoritmu dan nikmati cita rasa Nusantara.
        </p>

        <button
          onClick={() => onNavigate("Katalog")}
          className="mt-4 w-full rounded-xl bg-[#a85d3b] py-2.5 text-sm font-bold text-white transition hover:bg-[#8c492e]"
        >
          Jelajahi Menu
        </button>
      </div>

      {/* TOMBOL KELUAR */}
      <button
        onClick={() => onNavigate("Beranda")}
        className="mt-5 rounded-xl px-4 py-3 text-left text-sm font-semibold text-[#71665d] hover:bg-[#f7ede2]"
      >
        ↪ Keluar
      </button>
    </aside>
  );
}
