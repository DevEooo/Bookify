import { MapPin, Eye } from "lucide-react";
import { ImageWithFallback } from "../../components/fallback/ImageWithFallback";

interface CartItemCardProps {
  id: string;
  hotelName: string;
  city: string;
  image: string;
  checkIn: string;
  checkOut: string;
  price: string;
  guests?: number;
  nights?: number;
  totalPrice?: string;
  onViewDetails: () => void;
}

export function CartItemCard({
  hotelName,
  city,
  image,
  totalPrice,
  price,
  guests = 1,
  nights = 1,
  onViewDetails,
}: CartItemCardProps) {
  const displayTotal = totalPrice || price;

  return (
    <div className="bg-[#1a1c23] rounded-xl overflow-hidden border border-gray-700 hover:border-[#3b82f6] transition-all">
      <div className="flex gap-4 p-4">
        {/* Image */}
        <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
          <ImageWithFallback
            src={image}
            alt={hotelName}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <h3 className="text-[#e5e7eb] mb-1 truncate">{hotelName}</h3>
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{city}</span>
            </div>
            <div className="text-[#3b82f6]">{displayTotal}</div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center">
          <button
            onClick={onViewDetails}
            className="bg-[#3b82f6] text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <Eye className="w-4 h-4" />
            <span>Detail</span>
          </button>
        </div>
      </div>
    </div>
  );
}
