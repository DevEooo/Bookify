import { useState } from "react";
import { CreditCard, Wallet, Building2, ChevronRight, Check, ArrowLeft } from "lucide-react";
import { ImageWithFallback } from "../../components/fallback/ImageWithFallback";

interface PaymentItem {
  id: string;
  hotelName: string;
  city: string;
  image: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  pricePerNight: string;
  totalPrice: string;
}

interface SavedPaymentMethod {
  id: string;
  type: "credit-card" | "e-wallet" | "bank-transfer";
  isDefault: boolean;
  cardNumber?: string;
  cardExpiry?: string;
  cardName?: string;
  eWalletType?: string;
  phoneNumber?: string;
  bankName?: string;
}

interface CheckoutViewProps {
  items: PaymentItem[];
  savedPaymentMethods: SavedPaymentMethod[];
  onBack: () => void;
  onPaymentSuccess: () => void;
}

export function CheckoutView({ items, savedPaymentMethods, onBack, onPaymentSuccess }: CheckoutViewProps) {
  const defaultMethod = savedPaymentMethods.find(m => m.isDefault);
  const [selectedMethodId, setSelectedMethodId] = useState<string>(defaultMethod?.id || "");
  const [isProcessing, setIsProcessing] = useState(false);

  const calculateSubtotal = () => {
    return items.reduce((total, item) => {
      const price = parseInt(item.totalPrice.replace(/[^0-9]/g, ''));
      return total + price;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const serviceFee = Math.round(subtotal * 0.02); // 2% service fee
  const tax = Math.round(subtotal * 0.11); // 11% tax
  const total = subtotal + serviceFee + tax;

  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  const handlePayment = () => {
    if (!selectedMethodId) {
      return;
    }
    
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess();
    }, 2000);
  };

  const getMethodIcon = (type: string) => {
    switch (type) {
      case "credit-card":
        return CreditCard;
      case "e-wallet":
        return Wallet;
      case "bank-transfer":
        return Building2;
      default:
        return CreditCard;
    }
  };

  const getMethodLabel = (method: SavedPaymentMethod) => {
    if (method.type === "credit-card") {
      return `**** **** **** ${method.cardNumber?.slice(-4)}`;
    } else if (method.type === "e-wallet") {
      return `${method.eWalletType?.toUpperCase()} - ${method.phoneNumber}`;
    } else if (method.type === "bank-transfer") {
      return method.bankName?.toUpperCase();
    }
    return "Unknown";
  };

  const getMethodName = (type: string) => {
    switch (type) {
      case "credit-card":
        return "Kartu Kredit/Debit";
      case "e-wallet":
        return "E-Wallet";
      case "bank-transfer":
        return "Transfer Bank";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-[#e5e7eb] transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali ke Pemesanan</span>
        </button>
        <h2 className="text-[#e5e7eb] mb-2">Checkout</h2>
        <p className="text-gray-400">Pilih metode pembayaran dan selesaikan pemesanan Anda</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Checkout Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Booking Summary */}
          <div className="bg-[#1a1c23] rounded-xl p-6 border border-gray-700">
            <h3 className="text-[#e5e7eb] mb-4">Ringkasan Pemesanan</h3>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-700 last:border-0 last:pb-0">
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.hotelName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[#e5e7eb] text-sm mb-1">{item.hotelName}</h4>
                    <p className="text-gray-400 text-xs mb-2">{item.city}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>{item.guests} tamu</span>
                      <span>•</span>
                      <span>{item.nights} malam</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[#3b82f6]">{item.totalPrice}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="bg-[#1a1c23] rounded-xl p-6 border border-gray-700">
            <h3 className="text-[#e5e7eb] mb-4">Pilih Metode Pembayaran</h3>
            
            {savedPaymentMethods.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">Anda belum memiliki metode pembayaran tersimpan</p>
                <button
                  onClick={onBack}
                  className="text-[#3b82f6] hover:underline"
                >
                  Tambah metode pembayaran di halaman Pembayaran
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {savedPaymentMethods.map((method) => {
                  const Icon = getMethodIcon(method.type);
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethodId(method.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all ${
                        selectedMethodId === method.id
                          ? "border-[#3b82f6] bg-[#3b82f6]/10"
                          : "border-gray-700 hover:border-gray-600"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          selectedMethodId === method.id ? "bg-[#3b82f6]/20" : "bg-gray-700"
                        }`}>
                          <Icon className={`w-5 h-5 ${
                            selectedMethodId === method.id ? "text-[#3b82f6]" : "text-gray-400"
                          }`} />
                        </div>
                        <div className="text-left">
                          <p className="text-[#e5e7eb] text-sm">{getMethodName(method.type)}</p>
                          <p className="text-gray-400 text-xs">{getMethodLabel(method)}</p>
                        </div>
                      </div>
                      {selectedMethodId === method.id && (
                        <Check className="w-5 h-5 text-[#3b82f6]" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Price Summary */}
        <div className="lg:col-span-1">
          <div className="bg-[#1a1c23] rounded-xl p-6 border border-gray-700 sticky top-24">
            <h3 className="text-[#e5e7eb] mb-4">Rincian Harga</h3>
            <div className="space-y-3 mb-4 pb-4 border-b border-gray-700">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-[#e5e7eb]">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Biaya Layanan (2%)</span>
                <span className="text-[#e5e7eb]">{formatPrice(serviceFee)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Pajak (11%)</span>
                <span className="text-[#e5e7eb]">{formatPrice(tax)}</span>
              </div>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-[#e5e7eb]">Total Pembayaran</span>
              <span className="text-[#3b82f6] text-xl">{formatPrice(total)}</span>
            </div>
            <button
              onClick={handlePayment}
              disabled={isProcessing || !selectedMethodId}
              className="w-full bg-[#3b82f6] text-white py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <span>Bayar Sekarang</span>
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
            {!selectedMethodId && savedPaymentMethods.length > 0 && (
              <p className="text-red-400 text-xs text-center mt-2">
                Pilih metode pembayaran terlebih dahulu
              </p>
            )}
            <p className="text-gray-400 text-xs text-center mt-4">
              Dengan melanjutkan, Anda menyetujui syarat dan ketentuan kami
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
