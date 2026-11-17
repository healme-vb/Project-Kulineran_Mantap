import { useState } from "react";
import FoodCard from "../components/FoodCard";
import { foods, categories } from "../data/foods";
import type { FoodPageProps } from "../types/page";

export default function Katalog({
  favorites,
  onToggleFavorite,
  onAddToCart,
}: FoodPageProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [sortBy, setSortBy] = useState("rekomendasi");

  const filteredFoods = foods.filter((food) => {
    const matchesSearch = food.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "Semua" || food.category === selectedCategory;

    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case "harga-rendah":
        return a.price - b.price;
      case "harga-tinggi":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "nama":
        return a.name.localeCompare(b.name, "id");
      default:
        return Number(Boolean(b.popular)) - Number(Boolean(a.popular));
    }
  });

  return (
    <div className="space-y-7 pb-12">
      {/* Judul halaman katalog */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-[#a85d3b]">PILIHAN MENU</p>
          <h2 className="mt-2 text-3xl font-extrabold text-[#34261f]">
            Semua Makanan
          </h2>
          <p className="mt-2 text-sm text-[#8c8177]">
            Temukan hidangan favoritmu dari berbagai menu Nusantara.
          </p>
        </div>

        <div className="rounded-xl border border-[#eee5da] bg-white px-4 py-3">
          <p className="text-xs text-[#8c8177]">Total menu tersedia</p>
          <p className="mt-1 text-xl font-extrabold text-[#a0522d]">
            {foods.length} Menu
          </p>
        </div>
      </section>

      {/* Pencarian */}
      <section className="rounded-2xl border border-[#eee5da] bg-white p-4">
        <label
          htmlFor="search-food"
          className="mb-2 block text-sm font-bold text-[#34261f]"
        >
          Cari makanan
        </label>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="search-food"
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Contoh: Sate Ayam, Rendang, Bakso..."
            className="min-w-0 flex-1 rounded-xl border border-[#e9e1d7] bg-[#faf8f5] px-4 py-3 text-sm outline-none transition focus:border-[#a0522d]"
          />

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setSelectedCategory("Semua");
              setSortBy("rekomendasi");
            }}
            className="rounded-xl border border-[#e9e1d7] px-5 py-3 text-sm font-semibold text-[#6e5a4e] transition hover:bg-[#f8f5f0]"
          >
            Reset Filter
          </button>
        </div>
      </section>

      {/* Filter kategori */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-bold text-[#34261f]">Kategori Makanan</h3>
          <span className="text-xs text-[#8c8177]">
            {categories.length} kategori
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                selectedCategory === category
                  ? "bg-[#a0522d] text-white shadow-sm"
                  : "border border-[#e9e1d7] bg-white text-[#6e5a4e] hover:border-[#a0522d]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Daftar seluruh makanan */}
      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-2 border-b border-[#e9e1d7] pb-4">
          <div>
            <h3 className="text-xl font-extrabold text-[#34261f]">
              {selectedCategory === "Semua"
                ? "Jelajahi Semua Menu"
                : `Menu ${selectedCategory}`}
            </h3>
            <p className="mt-1 text-sm text-[#8c8177]">
              {search
                ? `Hasil pencarian untuk "${search}"`
                : "Pilih makanan dan tambahkan ke keranjang."}
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <label htmlFor="sort-foods" className="text-xs font-semibold text-[#8c8177]">
              Urutkan:
            </label>
            <select
              id="sort-foods"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="rounded-xl border border-[#e9e1d7] bg-white px-3 py-2.5 text-sm text-[#34261f] outline-none focus:border-[#a0522d]"
            >
              <option value="rekomendasi">Rekomendasi</option>
              <option value="harga-rendah">Harga terendah</option>
              <option value="harga-tinggi">Harga tertinggi</option>
              <option value="rating">Rating tertinggi</option>
              <option value="nama">Nama A–Z</option>
            </select>
            <span className="text-sm font-semibold text-[#a0522d]">
              {filteredFoods.length} hasil
            </span>
          </div>
        </div>

        {filteredFoods.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#e9e1d7] bg-white px-5 py-16 text-center">
            <p className="text-4xl">🍽️</p>
            <h4 className="mt-4 font-bold text-[#34261f]">
              Makanan tidak ditemukan
            </h4>
            <p className="mt-2 text-sm text-[#8c8177]">
              Coba kata kunci atau kategori lainnya.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedCategory("Semua");
                setSortBy("rekomendasi");
              }}
              className="mt-5 rounded-xl bg-[#a0522d] px-5 py-3 text-sm font-semibold text-white hover:bg-[#874326]"
            >
              Tampilkan Semua Menu
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:gap-5 xl:grid-cols-3">
            {filteredFoods.map((food) => (
              <FoodCard
                key={food.id}
                food={food}
                isFavorite={favorites.includes(food.id)}
                onToggleFavorite={onToggleFavorite}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
