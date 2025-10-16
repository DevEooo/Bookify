import { MapPin, Calendar, Trash2 } from "lucide-react";
import { ImageWithFallback } from "../../components/fallback/ImageWithFallback";

interface CartItemCardProps {
  id: string;
  hotelName: string;
  city: string;
  image: string;
  checkIn: string;
  checkOut: string;
  price: string;
  onOrder: () => void;
  onRemove: () => void;
}

export function CartItemCard({
  hotelName,
  city,
  image,
  checkIn,
  checkOut,
  price,
  onOrder,
  onRemove,
}: CartItemCardProps) {
  return (
    <div className="bg-[#1a1c23] rounded-xl overflow-hidden border border-gray-700 hover:border-[#3b82f6] transition-all">
      <div className="flex flex-col md:flex-row gap-4 p-4">
        {/* Image */}
        <div className="relative w-full md:w-44 h-44 rounded-lg overflow-hidden flex-shrink-0">
          <ImageWithFallback
            src={image}
            alt={hotelName}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-[#e5e7eb] mb-2">{hotelName}</h3>
            
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-1.5">
              <MapPin className="w-4 h-4" />
              <span>{city}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
              <Calendar className="w-4 h-4" />
              <span>{checkIn} - {checkOut}</span>
            </div>

            <div className="mb-3">
              <span className="text-[#3b82f6] text-xl">{price}</span>
              <span className="text-gray-400 text-sm"> / malam</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={onOrder}
              className="flex-1 bg-[#3b82f6] text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Pesan Sekarang
            </button>
            <button
              onClick={onRemove}
              className="bg-red-500/20 text-red-400 p-2 rounded-lg hover:bg-red-500/30 transition-colors"
              title="Hapus"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
