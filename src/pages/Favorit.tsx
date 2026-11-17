import type { Food } from "../types/food";
import FoodCard from "../components/FoodCard";

type FavoritProps = {
  foods: Food[];
  favorites: number[];
  onToggleFavorite: (id: number) => void;
  onAddToCart: (id: number) => void;
  onNavigateToCatalog: () => void;
};

export default function Favorit({
  foods,
  favorites,
  onToggleFavorite,
  onAddToCart,
  onNavigateToCatalog,
}: FavoritProps) {
  // Filter makanan yang ada di dalam daftar favorit
  const favoriteFoods = foods.filter((food) => favorites.includes(food.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-[#34261f]">
            Menu Favorit Saya
          </h2>
          <p className="text-xs text-[#8c8177] mt-1">
            Daftar kuliner lezat yang sudah kamu simpan.
          </p>
        </div>
      </div>

      {favoriteFoods.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#e9e1d7] bg-white p-12 text-center">
          <p className="text-sm font-semibold text-[#71665d] mb-3">
            Belum ada menu favorit yang ditambahkan.
          </p>
          <button
            onClick={onNavigateToCatalog}
            className="rounded-xl bg-[#a85d3b] px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#8c492e]"
          >
            Jelajahi Menu Sekarang
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {favoriteFoods.map((food) => (
            <FoodCard
              key={food.id}
              food={food}
              isFavorite={true}
              onToggleFavorite={onToggleFavorite}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
}
