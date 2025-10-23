import { CheckCircle, X, Calendar, Users } from "lucide-react";

interface PaymentItem {
  hotelName: string;
  city: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  nights?: number;
  pricePerNight: string;
  totalPrice: string;
}

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: PaymentItem[];
  subtotal: number;
  serviceFee: number;
  tax: number;
  total: number;
}

export function PaymentSuccessModal({ isOpen, onClose, items, subtotal, serviceFee, tax, total }: PaymentSuccessModalProps) {
  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1c23] rounded-xl max-w-2xl w-full border border-gray-700 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 sticky top-0 bg-[#1a1c23] z-10">
          <h3 className="text-[#e5e7eb]">Pembayaran Berhasil</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-[#e5e7eb] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            
            <h4 className="text-[#e5e7eb] mb-2">Pembayaran Anda Berhasil!</h4>
            <p className="text-gray-400 text-sm">
              Terima kasih telah melakukan pembayaran. Kami akan mengirimkan konfirmasi dan detail pemesanan ke email Anda.
            </p>
          </div>

          {/* Transaction Info */}
          <div className="bg-[#0f1117] rounded-lg p-4 mb-6 border border-gray-700">
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="text-gray-400">Nomor Transaksi:</span>
              <span className="text-[#e5e7eb]">TRX-{Date.now().toString().slice(-8)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Tanggal:</span>
              <span className="text-[#e5e7eb]">{new Date().toLocaleDateString('id-ID', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
            </div>
          </div>

          {/* Receipt Details */}
          <div className="bg-[#0f1117] rounded-lg p-4 mb-6 border border-gray-700">
            <h5 className="text-[#e5e7eb] mb-4">Detail Pemesanan</h5>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="pb-4 border-b border-gray-700 last:border-0 last:pb-0">
                  <h6 className="text-[#e5e7eb] text-sm mb-2">{item.hotelName}</h6>
                  <p className="text-gray-400 text-xs mb-3">{item.city}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar className="w-3 h-3" />
                      <span>Check-in:</span>
                    </div>
                    <span className="text-[#e5e7eb]">{item.checkIn || '-'}</span>
                    
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar className="w-3 h-3" />
                      <span>Check-out:</span>
                    </div>
                    <span className="text-[#e5e7eb]">{item.checkOut || '-'}</span>
                    
                    <div className="flex items-center gap-2 text-gray-400">
                      <Users className="w-3 h-3" />
                      <span>Jumlah Tamu:</span>
                    </div>
                    <span className="text-[#e5e7eb]">{item.guests || 1} orang</span>
                    
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar className="w-3 h-3" />
                      <span>Jumlah Malam:</span>
                    </div>
                    <span className="text-[#e5e7eb]">{item.nights || 1} malam</span>
                  </div>

                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-700">
                    <div>
                      <p className="text-gray-400 text-xs">Harga per orang/malam:</p>
                      <p className="text-[#e5e7eb] text-xs">{item.pricePerNight}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-xs">Subtotal:</p>
                      <p className="text-[#3b82f6]">{item.totalPrice}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-[#0f1117] rounded-lg p-4 mb-6 border border-gray-700">
            <h5 className="text-[#e5e7eb] mb-4">Rincian Pembayaran</h5>
            <div className="space-y-2 mb-3 pb-3 border-b border-gray-700">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-[#e5e7eb]">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Biaya Layanan (2%)</span>
                <span className="text-[#e5e7eb]">{formatPrice(serviceFee)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Pajak (11%)</span>
                <span className="text-[#e5e7eb]">{formatPrice(tax)}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#e5e7eb]">Total Dibayar</span>
              <span className="text-[#3b82f6] text-xl">{formatPrice(total)}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-[#3b82f6] text-white py-2.5 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
