export type FoodPageProps = {
  favorites: number[];
  onToggleFavorite: (id: number) => void;
  onAddToCart: (id: number) => void;
};
