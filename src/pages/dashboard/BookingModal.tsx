import { X, MapPin, Star } from "lucide-react";
import { ImageWithFallback } from "../../components/fallback/ImageWithFallback";

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: {
    hotelName: string;
    city: string;
    image: string;
    checkIn: string;
    checkOut: string;
    price?: string;
    rating?: number;
    guests?: number;
    roomType?: string;
    description?: string;
  } | null;
  onManageBooking?: (booking: any) => void;
}

export function BookingDetailsModal({ isOpen, onClose, booking, onManageBooking }: BookingDetailsModalProps) {
  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-[#1a1c23] rounded-2xl max-w-2xl w-full mx-4 border border-gray-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image */}
        <div className="relative h-64 overflow-hidden">
          <ImageWithFallback
            src={booking.image}
            alt={booking.hotelName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1c23] to-transparent"></div>
        </div>

        {/* Content */}
        <div className="p-5 -mt-8 relative">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-[#e5e7eb] mb-2">{booking.hotelName}</h2>
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>{booking.city}</span>
              </div>
            </div>
            {booking.rating && (
              <div className="flex items-center gap-1 bg-[#3b82f6] px-3 py-1 rounded-lg">
                <Star className="w-4 h-4 text-white fill-white" />
                <span className="text-white">{booking.rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {booking.price && (
            <div className="flex items-center justify-between mb-4 p-3 bg-[#0f1117] rounded-lg border border-gray-700">
              <span className="text-gray-400">Total Harga</span>
              <span className="text-[#3b82f6] text-xl">{booking.price}</span>
            </div>
          )}

          {booking.description && (
            <div className="mb-4 p-4 bg-[#0f1117] rounded-lg border border-gray-700">
              <h3 className="text-[#e5e7eb] mb-2">Deskripsi</h3>
              <p className="text-gray-400 leading-relaxed">{booking.description}</p>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => {
                if (onManageBooking) {
                  onManageBooking(booking);
                }
              }}
              className="flex-1 bg-[#3b82f6] text-white py-2.5 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Kelola Pemesanan
            </button>
            <button
              onClick={onClose}
              className="px-5 bg-gray-700 text-[#e5e7eb] py-2.5 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
