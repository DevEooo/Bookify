import { History, Calendar, Users, MapPin } from "lucide-react";
import { ImageWithFallback } from "../../components/fallback/ImageWithFallback";

interface HistoryItem {
  id: string;
  transactionId: string;
  date: string;
  hotelName: string;
  city: string;
  image: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  nights?: number;
  totalPaid: string;
  status: "completed" | "pending" | "cancelled";
}

interface HistoryViewProps {
  historyItems: HistoryItem[];
}

export function HistoryView({ historyItems }: HistoryViewProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Selesai";
      case "pending":
        return "Menunggu";
      case "cancelled":
        return "Dibatalkan";
      default:
        return status;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[#e5e7eb] mb-2">Riwayat Pemesanan</h2>
        <p className="text-gray-400">
          Lihat semua riwayat pemesanan dan transaksi Anda
        </p>
      </div>

      {historyItems.length === 0 ? (
        <div className="bg-[#1a1c23] rounded-xl p-12 text-center border border-gray-700">
          <History className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-[#e5e7eb] mb-2">Belum Ada Riwayat</h3>
          <p className="text-gray-400">
            Riwayat pemesanan Anda akan muncul di sini
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {historyItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#1a1c23] rounded-xl border border-gray-700 hover:border-[#3b82f6] transition-all overflow-hidden"
            >
              <div className="p-4">
                {/* Transaction Info Header */}
                <div className="flex justify-between items-start mb-4 pb-3 border-b border-gray-700">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">No. Transaksi</p>
                    <p className="text-[#e5e7eb] text-sm">{item.transactionId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-xs mb-1">Tanggal</p>
                    <p className="text-[#e5e7eb] text-sm">{item.date}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  {/* Image */}
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.hotelName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[#e5e7eb] mb-1">{item.hotelName}</h3>
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{item.city}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      {item.checkIn && (
                        <>
                          <div className="flex items-center gap-1.5 text-gray-400">
                            <Calendar className="w-3 h-3" />
                            <span>Check-in:</span>
                          </div>
                          <span className="text-[#e5e7eb]">{item.checkIn}</span>
                        </>
                      )}
                      
                      {item.checkOut && (
                        <>
                          <div className="flex items-center gap-1.5 text-gray-400">
                            <Calendar className="w-3 h-3" />
                            <span>Check-out:</span>
                          </div>
                          <span className="text-[#e5e7eb]">{item.checkOut}</span>
                        </>
                      )}
                      
                      {item.guests && (
                        <>
                          <div className="flex items-center gap-1.5 text-gray-400">
                            <Users className="w-3 h-3" />
                            <span>Tamu:</span>
                          </div>
                          <span className="text-[#e5e7eb]">{item.guests} orang</span>
                        </>
                      )}
                      
                      {item.nights && (
                        <>
                          <div className="flex items-center gap-1.5 text-gray-400">
                            <Calendar className="w-3 h-3" />
                            <span>Malam:</span>
                          </div>
                          <span className="text-[#e5e7eb]">{item.nights} malam</span>
                        </>
                      )}
                    </div>

                    <div className="flex justify-between items-end">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs border ${getStatusColor(item.status)}`}
                      >
                        {getStatusText(item.status)}
                      </span>
                      <div className="text-right">
                        <p className="text-gray-400 text-xs">Total Dibayar</p>
                        <p className="text-[#3b82f6]">{item.totalPaid}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
