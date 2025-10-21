import { MapPin, Calendar, Heart, ShoppingCart } from "lucide-react";
import { ImageWithFallback } from "../../components/fallback/ImageWithFallback";

interface BookingCardProps {
  hotelName: string;
  city: string;
  image: string;
  checkIn: string;
  checkOut: string;
  status?: "upcoming" | "past";
  price?: string;
  onViewDetails?: () => void;
  onBook?: (booking: any) => void;
  onWishlist?: () => void;
}

export function BookingCard({
  hotelName,
  city,
  image,
  checkIn,
  checkOut,
  status = "upcoming",
  price,
  onViewDetails,
  onBook,
  onWishlist,
}: BookingCardProps) {
  const handleBook = () => {
    if (onBook) {
      onBook({
        hotelName,
        city,
        image,
        checkIn,
        checkOut,
        price,
        guests: 1,
        nights: 1,
        rating: 0,
        roomType: "Standard Room",
      });
    }
  };

  return (
    <div className="bg-[#1a1c23] rounded-xl overflow-hidden border border-gray-700 hover:border-[#3b82f6] transition-all hover:shadow-lg hover:shadow-blue-500/10 group">
      <div className="relative h-48 overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={hotelName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {status === "past" && (
          <div className="absolute top-3 right-3 bg-gray-800/90 backdrop-blur-sm text-gray-300 px-3 py-1 rounded-full text-sm">
            Selesai
          </div>
        )}
        {status === "upcoming" && onWishlist && (
          <button
            onClick={onWishlist}
            className="absolute top-3 right-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2 rounded-full transition-colors group/heart"
          >
            <Heart className="w-5 h-5 text-white group-hover/heart:fill-pink-500 group-hover/heart:text-pink-500 transition-all" />
          </button>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-[#e5e7eb] mb-2">{hotelName}</h3>

        <div className="flex items-center gap-2 text-gray-400 text-sm mb-1.5">
          <MapPin className="w-4 h-4" />
          <span>{city}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
          <Calendar className="w-4 h-4" />
          <span>{checkIn} - {checkOut}</span>
        </div>

        {price && (
          <div className="mb-3">
            <span className="text-[#3b82f6]">{price}</span>
            <span className="text-gray-400 text-sm"> / malam</span>
          </div>
        )}

        <div className="flex gap-2">
          {status === "upcoming" ? (
            <>
              <button
                onClick={onViewDetails}
                className="flex-1 bg-[#3b82f6] text-white py-2 rounded-lg hover:bg-blue-600 transition-colors text-center"
              >
                Lihat Detail
              </button>
              {onBook && (
                <button
                  onClick={handleBook}
                  className="bg-gray-700 text-[#e5e7eb] p-2 rounded-lg hover:bg-gray-600 transition-colors"
                  title="Pesan Lagi"
                >
                  <ShoppingCart className="w-5 h-5" />
                </button>
              )}
            </>
          ) : (
            <>
              <button
                onClick={onViewDetails}
                className="flex-1 bg-gray-700 text-[#e5e7eb] py-2 rounded-lg hover:bg-gray-600 transition-colors text-center"
              >
                Lihat Detail
              </button>
              {onBook && (
                <button
                  onClick={handleBook}
                  className="bg-[#3b82f6] text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                  title="Pesan Lagi"
                >
                  <ShoppingCart className="w-5 h-5" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
