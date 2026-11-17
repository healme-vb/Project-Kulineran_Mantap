import type { Food } from "../types/food";
import { formatRupiah } from "../data/foods";

type FoodCardProps = {
  food: Food;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onAddToCart: (id: number) => void;
};

export default function FoodCard({
  food,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
}: FoodCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-[#eee5da] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5">
      {/* GAMBAR MAKANAN */}
      <div className="relative h-44 overflow-hidden bg-[#f4ede5] min-[420px]:h-36 sm:h-48">
        <img
          src={food.image}
          alt={food.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        {food.popular && (
          <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#a85d3b] shadow-sm">
            ★ Terpopuler
          </span>
        )}

        {/* TOMBOL FAVORIT */}
        <button
          type="button"
          onClick={() => onToggleFavorite(food.id)}
          aria-label={
            isFavorite
              ? `Hapus ${food.name} dari favorit`
              : `Tambahkan ${food.name} ke favorit`
          }
          aria-pressed={isFavorite}
          className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-2xl shadow-sm transition hover:scale-110 ${
            isFavorite ? "text-red-500" : "text-gray-400 hover:text-red-500"
          }`}
        >
          {isFavorite ? "♥" : "♡"}
        </button>
      </div>

      {/* INFORMASI MAKANAN */}
      <div className="p-3 sm:p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-[#a85d3b]">
            {food.category}
          </span>

          <span className="text-xs font-semibold text-gray-500">
            ★ {food.rating}
          </span>
        </div>

        <h3 className="mt-2 line-clamp-2 min-h-10 text-sm font-extrabold text-[#34261f] sm:text-base">
          {food.name}
        </h3>

        <p className="mt-1 min-h-10 text-[11px] leading-4 text-gray-500 sm:text-xs sm:leading-5">
          {food.description}
        </p>

        {/* HARGA DAN TOMBOL KERANJANG */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 sm:mt-4 sm:flex-nowrap">
          <span className="text-sm font-extrabold text-[#a85d3b] sm:text-base">
            {formatRupiah(food.price)}
          </span>

          <button
            type="button"
            onClick={() => onAddToCart(food.id)}
            className="rounded-xl bg-[#a85d3b] px-3 py-2.5 text-xs font-bold text-white transition hover:bg-[#8c492e] active:scale-95 sm:text-sm"
          >
            + Tambah
          </button>
        </div>
      </div>
    </article>
  );
}
