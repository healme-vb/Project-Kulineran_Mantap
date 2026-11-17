import { useState } from "react";
import FoodCard from "../components/FoodCard";
import { foods, categories, formatRupiah } from "../data/foods";
import type { FoodPageProps } from "../types/page";
import heroImage from "../assets/hero.png";

type BerandaProps = FoodPageProps & {
  onNavigateToCatalog?: () => void;
};

export default function Beranda({
  favorites,
  onToggleFavorite,
  onAddToCart,
  onNavigateToCatalog,
}: BerandaProps) {
  const [promoClaimed, setPromoClaimed] = useState(false);

  const featuredFoods = foods.filter((food) => food.popular).slice(0, 3);

  const averageRating = foods.length
    ? (
        foods.reduce((total, food) => total + food.rating, 0) / foods.length
      ).toFixed(1)
    : "0.0";

  const cheapestPrice = foods.length
    ? Math.min(...foods.map((food) => food.price))
    : 0;

  function handleClaimPromo() {
    setPromoClaimed(true);
    onNavigateToCatalog?.();
  }

  return (
    <div className="space-y-8 pb-12">
      {/* HERO */}
      <section className="grid overflow-hidden rounded-3xl bg-[#30231d] text-white shadow-sm lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
          <span className="w-fit rounded-full border border-[#d99a70]/40 bg-[#a85d3b]/20 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#f0b58e]">
            Kulineran Mantap
          </span>

          <h2 className="mt-5 max-w-xl text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
            Rasa Nusantara,{" "}
            <span className="text-[#e6a477]">langsung ke meja.</span>
          </h2>

          <p className="mt-4 max-w-lg text-sm leading-6 text-white/70 sm:text-base">
            Dari sate berbumbu sampai rendang kaya rempah, temukan hidangan yang
            bikin waktu makan jadi lebih menyenangkan.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <div className="rounded-xl bg-white/10 px-4 py-3">
              <p className="text-xl font-extrabold">{foods.length}</p>
              <p className="mt-1 text-xs text-white/60">Menu pilihan</p>
            </div>

            <div className="rounded-xl bg-white/10 px-4 py-3">
              <p className="text-xl font-extrabold">★ {averageRating}</p>
              <p className="mt-1 text-xs text-white/60">Rating menu</p>
            </div>

            <div className="rounded-xl bg-white/10 px-4 py-3">
              <p className="text-xl font-extrabold">{favorites.length}</p>
              <p className="mt-1 text-xs text-white/60">Menu favoritmu</p>
            </div>
          </div>

          <button
            onClick={onNavigateToCatalog}
            className="mt-6 w-fit rounded-xl bg-[#e6a477] px-5 py-3 font-bold text-[#30231d] transition hover:bg-[#f0b58e] active:scale-95"
          >
            Jelajahi Menu →
          </button>
        </div>

        <div className="relative min-h-64 lg:min-h-[420px]">
          <img
            src={heroImage}
            alt="Hidangan pilihan Kulineran Mantap"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#30231d] via-[#30231d]/20 to-transparent lg:bg-gradient-to-l lg:from-transparent lg:via-transparent lg:to-[#30231d]/10" />

          <div className="absolute bottom-5 left-5 rounded-2xl border border-white/20 bg-black/40 px-4 py-3 backdrop-blur-sm sm:bottom-7 sm:left-7">
            <p className="text-xs text-white/70">Rekomendasi hari ini</p>
            <p className="mt-1 font-bold">Makan enak, hati senang.</p>
          </div>
        </div>
      </section>

      {/* PROMO INTERAKTIF */}
      <section className="relative overflow-hidden rounded-3xl border border-[#e8c5a9] bg-gradient-to-r from-[#f7e5d4] to-[#fff6eb] p-6 sm:p-8">
        <div className="absolute -right-8 -top-10 text-9xl opacity-10">🍱</div>

        <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div className="max-w-xl">
            <span className="inline-flex rounded-full bg-[#a85d3b] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
              Promo spesial
            </span>

            <h2 className="mt-4 text-2xl font-black text-[#34261f] sm:text-3xl">
              Lapar datang, promo menyerang!
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#78675a]">
              Temukan makanan favoritmu dan nikmati pengalaman kulineran yang
              lebih menyenangkan.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="rounded-lg border border-dashed border-[#a85d3b] px-3 py-2 font-mono text-sm font-bold text-[#8c492e]">
                MANTAPHEMAT
              </span>

              <span className="text-xs text-[#78675a]">Kode promo demo</span>
            </div>

            <button
              onClick={handleClaimPromo}
              className="mt-5 rounded-xl bg-[#a85d3b] px-5 py-3 font-bold text-white transition hover:bg-[#8c492e] active:scale-95"
            >
              {promoClaimed ? "Lihat Menu Lagi →" : "Jelajahi Menu Promo →"}
            </button>
          </div>

          <div className="hidden shrink-0 text-8xl sm:block">🍛</div>
        </div>
      </section>

      {/* KATEGORI */}
      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a85d3b]">
              Jelajahi rasa
            </p>
            <h2 className="mt-1 text-xl font-extrabold text-[#34261f] sm:text-2xl">
              Lagi pengin makan apa?
            </h2>
          </div>

          <span className="hidden text-sm text-[#8c8177] sm:block">
            Pilih kategori favorit
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
          {categories
            .filter((category) => category !== "Semua")
            .map((category, index) => {
              const categoryFood = foods.find(
                (food) => food.category === category,
              );

              const symbols = ["🍚", "🍗", "🍢", "🍜", "🥩", "🍰"];

              return (
                <button
                  key={category}
                  onClick={onNavigateToCatalog}
                  className="rounded-2xl border border-[#eee5da] bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-[#d7b39b] hover:shadow-sm"
                >
                  <span className="text-2xl">
                    {symbols[index % symbols.length]}
                  </span>

                  <p className="mt-3 font-bold text-[#34261f]">{category}</p>

                  <p className="mt-1 text-xs text-[#8c8177]">
                    {foods.filter((food) => food.category === category).length}{" "}
                    pilihan
                  </p>

                  {categoryFood && (
                    <p className="mt-2 truncate text-xs text-[#a85d3b]">
                      Contoh: {categoryFood.name}
                    </p>
                  )}
                </button>
              );
            })}
        </div>
      </section>

      {/* MENU POPULER */}
      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a85d3b]">
              Pilihan pelanggan
            </p>

            <h2 className="mt-1 text-xl font-extrabold text-[#34261f] sm:text-2xl">
              Menu yang lagi populer
            </h2>

            <p className="mt-1 text-sm text-[#8c8177]">
              Tiga hidangan unggulan untuk mulai kulineran.
            </p>
          </div>

          <button
            onClick={onNavigateToCatalog}
            className="hidden rounded-full bg-[#f1e5da] px-3 py-1.5 text-xs font-bold text-[#8c492e] transition hover:bg-[#e8d3c1] sm:inline-flex"
          >
            Lihat semua →
          </button>
        </div>

        {featuredFoods.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {featuredFoods.map((food) => (
              <FoodCard
                key={food.id}
                food={food}
                isFavorite={favorites.includes(food.id)}
                onToggleFavorite={onToggleFavorite}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-[#eee5da] bg-white p-6 text-center">
            <p className="font-semibold text-[#34261f]">
              Belum ada menu populer.
            </p>
            <p className="mt-2 text-sm text-[#8c8177]">
              Menu tetap tersedia di katalog.
            </p>
            <button
              onClick={onNavigateToCatalog}
              className="mt-4 rounded-xl bg-[#a85d3b] px-5 py-3 font-bold text-white hover:bg-[#8c492e]"
            >
              Buka Katalog
            </button>
          </div>
        )}
      </section>

      {/* REKOMENDASI HEMAT */}
      <section className="flex flex-col gap-4 rounded-2xl border border-[#e8d7c8] bg-[#f2e7dc] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a0522d]">
            Rekomendasi hemat
          </p>

          <h2 className="mt-1 text-xl font-extrabold text-[#34261f]">
            Mulai dari {formatRupiah(cheapestPrice)}
          </h2>

          <p className="mt-1 text-sm text-[#78675a]">
            Makanan lezat nggak harus bikin dompet ikut berpuasa.
          </p>
        </div>

        <button
          onClick={onNavigateToCatalog}
          className="rounded-xl bg-white/80 px-4 py-3 text-sm font-bold text-[#8c492e] transition hover:bg-white"
        >
          Pilih Menu →
        </button>
      </section>
    </div>
  );
}
