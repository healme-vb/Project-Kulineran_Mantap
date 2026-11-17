import { useState } from "react";

type RatingKepuasanProps = {
  onSubmit: (rating: number, komentar: string) => void;
  onSkip: () => void;
};

export default function RatingKepuasan({
  onSubmit,
  onSkip,
}: RatingKepuasanProps) {
  const [rating, setRating] = useState(0);
  const [komentar, setKomentar] = useState("");

  return (
    <div className="mx-auto w-full max-w-lg rounded-3xl border border-[#eee5da] bg-white p-6 text-center shadow-sm sm:p-8">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f7e5d4] text-3xl">
        ❤️
      </div>

      <h2 className="mt-5 text-2xl font-black text-[#34261f]">
        Bagaimana pengalamanmu?
      </h2>

      <p className="mt-2 text-sm leading-6 text-[#8c8177]">
        Bantu kami meningkatkan kualitas Kulineran Mantap dengan memberikan
        rating kepuasanmu.
      </p>

      <div className="mt-6 flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((bintang) => (
          <button
            key={bintang}
            type="button"
            onClick={() => setRating(bintang)}
            aria-label={`Beri rating ${bintang} bintang`}
            aria-pressed={rating === bintang}
            className={`text-4xl transition hover:scale-110 ${
              bintang <= rating ? "text-amber-400" : "text-gray-300"
            }`}
          >
            ★
          </button>
        ))}
      </div>

      <p className="mt-3 text-sm font-semibold text-[#a85d3b]">
        {rating === 0 && "Pilih rating kepuasanmu"}
        {rating === 1 && "Sangat tidak puas"}
        {rating === 2 && "Tidak puas"}
        {rating === 3 && "Cukup puas"}
        {rating === 4 && "Puas"}
        {rating === 5 && "Sangat puas!"}
      </p>

      <div className="mt-6 text-left">
        <label
          htmlFor="komentar-rating"
          className="mb-2 block text-sm font-bold text-[#34261f]"
        >
          Komentar (opsional)
        </label>

        <textarea
          id="komentar-rating"
          value={komentar}
          onChange={(event) => setKomentar(event.target.value)}
          placeholder="Ceritakan pengalaman belanjamu..."
          rows={4}
          maxLength={500}
          className="w-full resize-none rounded-xl border border-[#e8d7c8] p-4 text-sm outline-none transition focus:border-[#a85d3b] focus:ring-2 focus:ring-[#a85d3b]/20"
        />

        <p className="mt-1 text-right text-xs text-[#8c8177]">
          {komentar.length}/500 karakter
        </p>
      </div>

      <button
        type="button"
        disabled={rating === 0}
        onClick={() => onSubmit(rating, komentar)}
        className="mt-5 w-full rounded-xl bg-[#a85d3b] px-5 py-3 font-bold text-white transition hover:bg-[#8c492e] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Kirim Rating
      </button>

      <button
        type="button"
        onClick={onSkip}
        className="mt-3 w-full rounded-xl px-5 py-3 text-sm font-semibold text-[#8c8177] transition hover:bg-[#f7f2ec]"
      >
        Lewati
      </button>
    </div>
  );
}
