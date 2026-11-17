import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import type { CartItem, Order } from "../types/food";

type ProfilSayaProps = {
  cart: CartItem[];
  favorites: number[];
  orders: Order[];
  onNavigate: (page: string) => void;
};

type ProfileData = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

const defaultProfile: ProfileData = {
  name: "Pengguna Kulineran",
  email: "",
  phone: "",
  address: "",
};

const PROFILE_KEY = "kulineran-profile";
const PHOTO_KEY = "kulineran-profile-photo";

function getSavedProfile(): ProfileData {
  try {
    const saved = localStorage.getItem(PROFILE_KEY);

    if (saved) {
      return { ...defaultProfile, ...JSON.parse(saved) };
    }
  } catch {
    // Gunakan profil default jika data tidak valid.
  }

  return { ...defaultProfile };
}

function getSavedPhoto(): string {
  try {
    return localStorage.getItem(PHOTO_KEY) ?? "";
  } catch {
    return "";
  }
}

export default function ProfilSaya({
  cart,
  favorites,
  orders,
  onNavigate,
}: ProfilSayaProps) {
  const [profile, setProfile] = useState<ProfileData>(getSavedProfile);
  const [savedProfile, setSavedProfile] =
    useState<ProfileData>(getSavedProfile);
  const [photo, setPhoto] = useState(getSavedPhoto);
  const [savedPhoto, setSavedPhoto] = useState(getSavedPhoto);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  function handleChange(field: keyof ProfileData, value: string) {
    setProfile((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("File harus berupa gambar.");
      event.target.value = "";
      return;
    }

    // Batasi ukuran agar localStorage tidak cepat penuh.
    if (file.size > 1.5 * 1024 * 1024) {
      setMessage("Ukuran foto maksimal 1,5 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPhoto(reader.result);
        setMessage("Preview foto berhasil diperbarui. Klik Simpan Perubahan.");
      }
    };

    reader.onerror = () => {
      setMessage("Foto gagal dibaca. Coba pilih gambar lain.");
    };

    reader.readAsDataURL(file);
  }

  function handleSave() {
    if (!profile.name.trim()) {
      setMessage("Nama lengkap tidak boleh kosong.");
      return;
    }

    try {
      const cleanedProfile: ProfileData = {
        name: profile.name.trim(),
        email: profile.email.trim(),
        phone: profile.phone.trim(),
        address: profile.address.trim(),
      };

      localStorage.setItem(PROFILE_KEY, JSON.stringify(cleanedProfile));

      if (photo) {
        localStorage.setItem(PHOTO_KEY, photo);
      } else {
        localStorage.removeItem(PHOTO_KEY);
      }

      setProfile(cleanedProfile);
      setSavedProfile(cleanedProfile);
      setSavedPhoto(photo);
      setIsEditing(false);
      setMessage("Profil dan foto berhasil disimpan.");
    } catch {
      setMessage(
        "Penyimpanan gagal. Hapus foto yang terlalu besar atau kosongkan penyimpanan browser.",
      );
    }
  }

  function handleCancel() {
    setProfile({ ...savedProfile });
    setPhoto(savedPhoto);
    setIsEditing(false);
    setMessage("");
  }

  function handleEdit() {
    if (isEditing) {
      handleCancel();
      return;
    }

    setIsEditing(true);
    setMessage("");
  }

  function handleRemovePhoto() {
    setPhoto("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setMessage("Foto akan dihapus setelah perubahan disimpan.");
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header profil */}
      <section className="rounded-3xl bg-gradient-to-r from-[#a85d3b] to-[#c47b51] p-6 text-white sm:p-8">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white/40 bg-white/20 text-4xl">
              {photo ? (
                <img
                  src={photo}
                  alt="Foto profil"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>👤</span>
              )}
            </div>

            {isEditing && (
              <div className="flex flex-col items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                  id="profile-photo-input"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-lg bg-white px-3 py-2 text-xs font-bold text-[#a85d3b] hover:bg-[#fff1e5]"
                >
                  📷 Pilih Foto
                </button>

                {photo && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="text-xs font-semibold text-white underline"
                  >
                    Hapus Foto
                  </button>
                )}

                <p className="text-center text-xs text-white/80">
                  JPG, PNG, atau WebP. Maks. 1,5 MB.
                </p>
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm text-white/80">Selamat datang,</p>
            <h2 className="mt-1 break-words text-2xl font-extrabold">
              {profile.name || "Pengguna Kulineran"}
            </h2>
            <p className="mt-2 text-sm text-white/80">
              Kelola informasi akun dan aktivitas kuliner kamu.
            </p>
            {profile.email && (
              <p className="mt-2 break-all text-sm text-white/90">
                {profile.email}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleEdit}
            className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#a85d3b] transition hover:bg-[#fff1e5]"
          >
            {isEditing ? "Batal Mengedit" : "✎ Edit Profil"}
          </button>
        </div>
      </section>

      {/* Statistik */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => onNavigate("Favorit")}
          className="rounded-2xl border border-[#eee5da] bg-white p-5 text-left transition hover:-translate-y-1 hover:shadow-md"
        >
          <span className="text-2xl">❤️</span>
          <p className="mt-4 text-sm text-[#8c8177]">Menu Favorit</p>
          <p className="mt-1 text-2xl font-extrabold">{favorites.length}</p>
          <p className="mt-2 text-xs font-semibold text-[#a85d3b]">
            Lihat favorit →
          </p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate("Keranjang")}
          className="rounded-2xl border border-[#eee5da] bg-white p-5 text-left transition hover:-translate-y-1 hover:shadow-md"
        >
          <span className="text-2xl">🛒</span>
          <p className="mt-4 text-sm text-[#8c8177]">Item Keranjang</p>
          <p className="mt-1 text-2xl font-extrabold">{cartCount}</p>
          <p className="mt-2 text-xs font-semibold text-[#a85d3b]">
            Buka keranjang →
          </p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate("Riwayat Pesanan")}
          className="rounded-2xl border border-[#eee5da] bg-white p-5 text-left transition hover:-translate-y-1 hover:shadow-md"
        >
          <span className="text-2xl">📦</span>
          <p className="mt-4 text-sm text-[#8c8177]">Total Pesanan</p>
          <p className="mt-1 text-2xl font-extrabold">{orders.length}</p>
          <p className="mt-2 text-xs font-semibold text-[#a85d3b]">
            Lihat riwayat →
          </p>
        </button>
      </section>

      {/* Informasi pribadi */}
      <section className="rounded-2xl border border-[#eee5da] bg-white p-5 sm:p-7">
        <div className="mb-6">
          <h3 className="text-xl font-extrabold">Informasi Pribadi</h3>
          <p className="mt-1 text-sm text-[#8c8177]">
            {isEditing
              ? "Perbarui data diri kamu, lalu simpan perubahan."
              : "Data diri yang tersimpan pada browser ini."}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="profile-name"
              className="mb-2 block text-sm font-semibold"
            >
              Nama Lengkap
            </label>
            <input
              id="profile-name"
              type="text"
              value={profile.name}
              readOnly={!isEditing}
              onChange={(event) => handleChange("name", event.target.value)}
              placeholder="Masukkan nama lengkap"
              className={`w-full rounded-xl border border-[#e9e1d7] p-3 text-sm outline-none focus:border-[#a85d3b] ${
                isEditing ? "bg-[#fffdf9]" : "bg-[#f8f5f0]"
              }`}
            />
          </div>

          <div>
            <label
              htmlFor="profile-email"
              className="mb-2 block text-sm font-semibold"
            >
              Email
            </label>
            <input
              id="profile-email"
              type="email"
              value={profile.email}
              readOnly={!isEditing}
              onChange={(event) => handleChange("email", event.target.value)}
              placeholder="nama@email.com"
              className={`w-full rounded-xl border border-[#e9e1d7] p-3 text-sm outline-none focus:border-[#a85d3b] ${
                isEditing ? "bg-[#fffdf9]" : "bg-[#f8f5f0]"
              }`}
            />
          </div>

          <div>
            <label
              htmlFor="profile-phone"
              className="mb-2 block text-sm font-semibold"
            >
              Nomor Telepon
            </label>
            <input
              id="profile-phone"
              type="tel"
              value={profile.phone}
              readOnly={!isEditing}
              onChange={(event) => handleChange("phone", event.target.value)}
              placeholder="08xxxxxxxxxx"
              className={`w-full rounded-xl border border-[#e9e1d7] p-3 text-sm outline-none focus:border-[#a85d3b] ${
                isEditing ? "bg-[#fffdf9]" : "bg-[#f8f5f0]"
              }`}
            />
          </div>

          <div>
            <label
              htmlFor="profile-address"
              className="mb-2 block text-sm font-semibold"
            >
              Alamat
            </label>
            <textarea
              id="profile-address"
              value={profile.address}
              readOnly={!isEditing}
              onChange={(event) => handleChange("address", event.target.value)}
              placeholder="Masukkan alamat lengkap"
              rows={3}
              className={`w-full resize-y rounded-xl border border-[#e9e1d7] p-3 text-sm outline-none focus:border-[#a85d3b] ${
                isEditing ? "bg-[#fffdf9]" : "bg-[#f8f5f0]"
              }`}
            />
          </div>
        </div>

        {message && (
          <p
            role="status"
            className="mt-4 break-words text-sm font-semibold text-[#a85d3b]"
          >
            {message}
          </p>
        )}

        {isEditing && (
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSave}
              className="rounded-xl bg-[#a85d3b] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#8c492e]"
            >
              Simpan Perubahan
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="rounded-xl border border-[#e9e1d7] px-6 py-3 text-sm font-bold transition hover:bg-[#f8f5f0]"
            >
              Batal
            </button>
          </div>
        )}
      </section>

      {/* Pesanan terbaru */}
      <section className="rounded-2xl border border-[#eee5da] bg-white p-5 sm:p-7">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-extrabold">Pesanan Terbaru</h3>
            <p className="mt-1 text-sm text-[#8c8177]">
              Ringkasan aktivitas pemesananmu.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate("Riwayat Pesanan")}
            className="text-sm font-bold text-[#a85d3b] hover:underline"
          >
            Lihat semua →
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-xl bg-[#f8f5f0] p-6 text-center">
            <p className="text-3xl">🍽️</p>
            <p className="mt-3 font-bold">Belum ada pesanan</p>
            <p className="mt-1 text-sm text-[#8c8177]">
              Pesananmu akan muncul di sini setelah checkout.
            </p>
            <button
              type="button"
              onClick={() => onNavigate("Katalog")}
              className="mt-4 rounded-xl bg-[#a85d3b] px-5 py-3 text-sm font-bold text-white hover:bg-[#8c492e]"
            >
              Jelajahi Katalog
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 3).map((order: Order) => (
              <div
                key={order.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#eee5da] p-4"
              >
                <div>
                  <p className="font-bold">Pesanan #{order.id}</p>
                  <p className="mt-1 text-xs text-[#8c8177]">{order.date}</p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    order.status === "Selesai"
                      ? "bg-emerald-100 text-emerald-700"
                      : order.status === "Sedang diantar"
                        ? "bg-sky-100 text-sky-700"
                        : order.status === "Diproses"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
