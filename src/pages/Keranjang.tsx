import { useState } from "react";
import type { CartItem } from "../types/food";
import { formatRupiah } from "../data/foods";
import RatingKepuasan from "../components/RatingKepuasan";

type KeranjangProps = {
  cart: CartItem[];
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemoveItem: (id: number) => void;
  onCheckout: (diskon: number) => void;
  onNavigateToCatalog: () => void;
};

const ONGKIR = 10000;
const KODE_PROMO = "AYOMAKANENAK";
const PERSENTASE_DISKON = 0.07;

export default function Keranjang({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onNavigateToCatalog,
}: KeranjangProps) {
  const [alamat, setAlamat] = useState("");
  const [pesananSelesai, setPesananSelesai] = useState(false);
  const [error, setError] = useState("");

  const [kodePromo, setKodePromo] = useState("");
  const [promoAktif, setPromoAktif] = useState(false);
  const [pesanPromo, setPesanPromo] = useState("");

  const [ratingTerkirim, setRatingTerkirim] = useState(false);
  const [ratingDilewati, setRatingDilewati] = useState(false);
  const [ratingNilai, setRatingNilai] = useState(0);
  const [ratingKomentar, setRatingKomentar] = useState("");

  const subtotal = cart.reduce(
    (total, item) => total + item.food.price * item.quantity,
    0,
  );

  const diskon = promoAktif ? Math.round(subtotal * PERSENTASE_DISKON) : 0;

  const total = subtotal - diskon + ONGKIR;

  function handleTerapkanPromo() {
    if (cart.length === 0) {
      setPromoAktif(false);
      setPesanPromo("Keranjang masih kosong.");
      return;
    }

    if (kodePromo.trim().toUpperCase() === KODE_PROMO) {
      setPromoAktif(true);
      setPesanPromo("Berhasil! Diskon 7% telah diterapkan.");
    } else {
      setPromoAktif(false);
      setPesanPromo(
        kodePromo.trim() === ""
          ? "Masukkan kode promo terlebih dahulu."
          : "Kode promo tidak valid.",
      );
    }
  }

  function handleCheckout() {
    if (cart.length === 0) {
      setError("Keranjang masih kosong. Pilih makanan dulu!");
      return;
    }

    if (alamat.trim().length < 15) {
      setError(
        "Masukkan alamat lengkap, termasuk nama jalan, nomor rumah, dan daerah.",
      );
      return;
    }

    setError("");
    onCheckout(diskon);
    setPesananSelesai(true);
  }

  function handleSubmitRating(rating: number, komentar: string) {
    setRatingNilai(rating);
    setRatingKomentar(komentar);
    setRatingTerkirim(true);
  }

  function handleBackToCart() {
    setPesananSelesai(false);
    setAlamat("");
    setError("");
  }

  function handleOrderAgain() {
    setPesananSelesai(false);
    setAlamat("");
    setError("");
    setKodePromo("");
    setPromoAktif(false);
    setPesanPromo("");
    setRatingTerkirim(false);
    setRatingDilewati(false);
    setRatingNilai(0);
    setRatingKomentar("");
    onNavigateToCatalog();
  }

  if (pesananSelesai) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
        <div className="rounded-3xl border border-gray-100 bg-white px-6 py-10 text-center shadow-lg sm:px-12">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-14 w-14 text-green-600"
              aria-hidden="true"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>

          <h1 className="mb-3 text-2xl font-bold text-gray-900 sm:text-3xl">
            Pesanan Berhasil!
          </h1>

          <p className="mx-auto max-w-md text-base leading-relaxed text-gray-600">
            Pesanan Anda sedang diproses dan diperkirakan akan sampai dalam{" "}
            <span className="font-bold text-green-600">30 menit.</span>
          </p>

          <div className="mx-auto mt-7 max-w-md rounded-2xl bg-green-50 p-5 text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5 text-green-700"
                  aria-hidden="true"
                >
                  <path d="M3 7h11v10H3z" />
                  <path d="M14 10h4l3 3v4h-7z" />
                  <circle cx="7.5" cy="19" r="1.5" />
                  <circle cx="17.5" cy="19" r="1.5" />
                </svg>
              </div>

              <div>
                <p className="font-semibold text-green-800">
                  Pesanan sedang disiapkan
                </p>
                <p className="text-sm text-green-700">
                  Mohon tunggu, makanan segera dikirim.
                </p>
              </div>
            </div>
          </div>
        </div>

        {!ratingTerkirim && !ratingDilewati && (
          <RatingKepuasan
            onSubmit={handleSubmitRating}
            onSkip={() => setRatingDilewati(true)}
          />
        )}

        {ratingTerkirim && (
          <div className="rounded-3xl border border-[#eee5da] bg-white p-7 text-center shadow-sm">
            <div className="text-4xl">💖</div>

            <h2 className="mt-3 text-xl font-extrabold text-[#34261f]">
              Terima kasih atas ratingmu!
            </h2>

            <p className="mt-2 text-sm text-[#8c8177]">
              Rating kepuasanmu berhasil dicatat pada sesi ini.
            </p>

            <div
              className="mt-4 text-3xl text-amber-400"
              aria-label={`Rating ${ratingNilai} dari 5 bintang`}
            >
              {"★".repeat(ratingNilai)}
              <span className="text-gray-300">
                {"★".repeat(5 - ratingNilai)}
              </span>
            </div>

            {ratingKomentar.trim() && (
              <p className="mt-4 rounded-xl bg-[#f7f2ec] p-4 text-sm text-[#78675a]">
                "{ratingKomentar}"
              </p>
            )}

            <p className="mt-4 text-xs text-gray-500">
              Rating ini hanya tersimpan sementara di halaman. Belum dikirim ke
              admin atau database.
            </p>
          </div>
        )}

        {ratingDilewati && (
          <div className="rounded-2xl border border-[#eee5da] bg-white p-6 text-center">
            <p className="font-semibold text-[#34261f]">
              Terima kasih sudah berbelanja!
            </p>
            <p className="mt-2 text-sm text-[#8c8177]">
              Kamu melewati penilaian kepuasan.
            </p>
          </div>
        )}

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={handleOrderAgain}
            className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
          >
            Pesan Makanan Lagi
          </button>

          <button
            onClick={handleBackToCart}
            className="rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Kembali ke Keranjang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Keranjang Belanja
        </h1>
        <p className="mt-2 text-gray-500">
          Periksa pesanan dan lengkapi alamat pengiriman Anda.
        </p>
      </div>

      {cart.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mb-4 text-6xl">🛒</div>

          <h2 className="text-xl font-bold text-gray-800">
            Keranjang masih kosong
          </h2>

          <p className="mt-2 text-gray-500">
            Pilih makanan favorit Anda untuk mulai memesan.
          </p>

          <button
            onClick={onNavigateToCatalog}
            className="mt-6 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
          >
            Lihat Katalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          <section className="space-y-4 lg:col-span-2">
            {cart.map((item) => (
              <div
                key={item.food.id}
                className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
              >
                <img
                  src={item.food.image}
                  alt={item.food.name}
                  className="h-28 w-full rounded-xl object-cover sm:w-32"
                />

                <div className="min-w-0 flex-1">
                  <p className="text-sm text-green-600">{item.food.category}</p>

                  <h3 className="mt-1 font-bold text-gray-900">
                    {item.food.name}
                  </h3>

                  <p className="mt-2 font-semibold text-gray-800">
                    {formatRupiah(item.food.price)}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <div className="flex items-center rounded-lg border border-gray-200">
                      <button
                        onClick={() => onUpdateQuantity(item.food.id, -1)}
                        className="px-3 py-1.5 text-lg hover:bg-gray-100"
                        aria-label={`Kurangi ${item.food.name}`}
                      >
                        −
                      </button>

                      <span className="min-w-9 text-center font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => onUpdateQuantity(item.food.id, 1)}
                        className="px-3 py-1.5 text-lg hover:bg-gray-100"
                        aria-label={`Tambah ${item.food.name}`}
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.food.id)}
                      className="text-sm font-medium text-red-500 hover:text-red-700"
                    >
                      Hapus
                    </button>
                  </div>
                </div>

                <div className="text-left font-bold text-gray-900 sm:text-right">
                  {formatRupiah(item.food.price * item.quantity)}
                </div>
              </div>
            ))}

            <button
              onClick={onNavigateToCatalog}
              className="font-semibold text-green-700 hover:text-green-800"
            >
              ← Tambah makanan lainnya
            </button>
          </section>

          <aside className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">
              Alamat Pengiriman
            </h2>

            <label
              htmlFor="alamat"
              className="mt-4 block text-sm font-medium text-gray-700"
            >
              Alamat lengkap
            </label>

            <textarea
              id="alamat"
              value={alamat}
              onChange={(event) => setAlamat(event.target.value)}
              placeholder="Contoh: Jl. Melati No. 10, RT 02/RW 03, Kelurahan..., Kecamatan..., Jakarta Timur"
              rows={4}
              className="mt-2 w-full resize-y rounded-xl border border-gray-200 p-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />

            <p className="mt-2 text-xs text-gray-500">
              Cantumkan jalan, nomor rumah, kelurahan, kecamatan, dan kota.
            </p>

            <div className="my-5 border-t border-gray-100" />

            <section className="rounded-xl border border-orange-100 bg-orange-50/50 p-4">
              <h2 className="font-bold text-gray-900">Punya Kode Promo?</h2>

              <p className="mt-1 text-sm text-gray-600">
                Ketik kode promo untuk mendapatkan diskon 7% semua makanan.
              </p>

              <form
                className="mt-3 flex gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  handleTerapkanPromo();
                }}
              >
                <input
                  type="text"
                  value={kodePromo}
                  onChange={(event) => {
                    setKodePromo(event.target.value);
                    setPromoAktif(false);
                    setPesanPromo("");
                  }}
                  placeholder="Ketik kode promo"
                  aria-label="Kode promo"
                  autoComplete="off"
                  className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm uppercase outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />

                <button
                  type="submit"
                  className="rounded-lg bg-orange-500 px-3 py-2.5 text-sm font-bold text-white transition hover:bg-orange-600"
                >
                  Terapkan
                </button>
              </form>

              {pesanPromo && (
                <p
                  role="status"
                  className={`mt-3 text-sm font-semibold ${
                    promoAktif ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {pesanPromo}
                </p>
              )}

              {promoAktif && (
                <button
                  type="button"
                  onClick={() => {
                    setPromoAktif(false);
                    setKodePromo("");
                    setPesanPromo("Kode promo berhasil dihapus.");
                  }}
                  className="mt-2 text-xs font-semibold text-gray-500 underline hover:text-gray-700"
                >
                  Hapus promo
                </button>
              )}
            </section>

            <div className="my-5 border-t border-gray-100" />

            <h2 className="mb-4 font-bold text-gray-900">Ringkasan Pesanan</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-3 text-gray-600">
                <span>Subtotal makanan</span>
                <span>{formatRupiah(subtotal)}</span>
              </div>

              <div className="flex justify-between gap-3 text-gray-600">
                <span>Ongkos kirim</span>
                <span>{formatRupiah(ONGKIR)}</span>
              </div>

              {promoAktif && (
                <div className="flex justify-between gap-3 font-semibold text-green-600">
                  <span>Diskon promo (7%)</span>
                  <span>-{formatRupiah(diskon)}</span>
                </div>
              )}

              <div className="border-t border-gray-100 pt-3">
                <div className="flex justify-between gap-3 text-base font-bold text-gray-900">
                  <span>Total</span>
                  <span>{formatRupiah(total)}</span>
                </div>
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600"
              >
                {error}
              </p>
            )}

            <button
              onClick={handleCheckout}
              className="mt-5 w-full rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700 active:scale-[0.98]"
            >
              Checkout Pesanan
            </button>

            <p className="mt-3 text-center text-xs text-gray-500">
              Estimasi pengiriman 30 menit setelah pesanan diproses.
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}
