import type { Order } from "../types/food";
import { formatRupiah } from "../data/foods";

type RiwayatPesananProps = {
  orders: Order[];
  onNavigateToCatalog: () => void;
  onUpdateOrderStatus: (orderId: string, status: Order["status"]) => void;
};

export default function RiwayatPesanan({
  orders,
  onNavigateToCatalog,
  onUpdateOrderStatus,
}: RiwayatPesananProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-[#34261f]">
          Riwayat Pesanan
        </h2>
        <p className="text-xs text-[#8c8177] mt-1">
          Daftar transaksi dan status pengiriman makananmu.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#e9e1d7] bg-white p-12 text-center">
          <p className="text-sm font-semibold text-[#71665d] mb-3">
            Belum ada riwayat pesanan.
          </p>
          <button
            onClick={onNavigateToCatalog}
            className="rounded-xl bg-[#a85d3b] px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#8c492e]"
          >
            Pesan Makanan Sekarang
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-[#eee5da] bg-white p-6 shadow-sm space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e9e1d7] pb-4">
                <div>
                  <span className="text-xs font-bold text-[#a85d3b]">
                    Pesanan #{order.id}
                  </span>
                  <p className="text-xs text-[#8c8177] mt-0.5">{order.date}</p>
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

              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between text-xs text-[#71665d]"
                  >
                    <span>
                      {item.food.name}{" "}
                      <strong className="text-[#34261f]">
                        x{item.quantity}
                      </strong>
                    </span>
                    <span className="font-semibold text-[#34261f]">
                      {formatRupiah(item.food.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="rounded-xl bg-[#faf7f2] p-4">
                <p className="mb-3 text-xs font-bold uppercase tracking-wide text-[#8c8177]">
                  Perjalanan pesanan
                </p>
                <div className="grid grid-cols-3 gap-2 text-center text-[11px] sm:text-xs">
                  {(["Diproses", "Sedang diantar", "Selesai"] as const).map((status, index) => {
                    const statusIndex = ["Diproses", "Sedang diantar", "Selesai"].indexOf(order.status);
                    const completed = statusIndex >= index;
                    return (
                      <div key={status} className="flex flex-col items-center gap-2">
                        <span className={`flex h-7 w-7 items-center justify-center rounded-full font-bold ${completed ? "bg-[#a85d3b] text-white" : "bg-[#e9e1d7] text-[#8c8177]"}`}>
                          {completed ? "✓" : index + 1}
                        </span>
                        <span className={completed ? "font-semibold text-[#8c492e]" : "text-[#8c8177]"}>
                          {status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-[#e9e1d7] pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex justify-between text-sm font-extrabold text-[#34261f] sm:flex-col sm:gap-1">
                  <span>Total Pembayaran</span>
                  <span className="text-[#a85d3b]">
                    {formatRupiah(order.total)}
                  </span>
                </div>
                {order.status !== "Selesai" && order.status !== "Dibatalkan" && (
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateOrderStatus(
                        order.id,
                        order.status === "Diproses" ? "Sedang diantar" : "Selesai",
                      )
                    }
                    className="rounded-xl bg-[#a85d3b] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#8c492e]"
                  >
                    {order.status === "Diproses" ? "Simulasikan pesanan dikirim" : "Tandai pesanan selesai"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
