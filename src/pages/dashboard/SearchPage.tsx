import { Search, MapPin, Star, Users, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { BookingCard } from "./BookingList";
import { fetchHotels, type Hotel } from "../../../function/utilities/firestoreUtils";

interface SearchHotelsViewProps {
  onViewDetails: (hotel: any) => void;
  onBook: (booking: any) => void;
  onWishlist: (hotel: any) => void;
}

export function SearchHotelsView({ onViewDetails, onBook, onWishlist }: SearchHotelsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("all");
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHotels = async () => {
      try {
        const fetchedHotels = await fetchHotels();
        setHotels(fetchedHotels);
      } catch (error) {
        console.error("Failed to fetch hotels:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHotels();
  }, []);

  const destinations = [
    { value: "all", label: "Semua Destinasi" },
    { value: "bali", label: "Bali" },
    { value: "jakarta", label: "Jakarta" },
    { value: "internasional", label: "Internasional" },
  ];

  const filteredHotels = hotels.filter((hotel) => {
    const matchesSearch = hotel.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         hotel.lokasi.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesDestination = true;
    if (selectedDestination === "bali") {
      matchesDestination = hotel.lokasi.toLowerCase().includes("bali");
    } else if (selectedDestination === "jakarta") {
      matchesDestination = hotel.lokasi.toLowerCase().includes("jakarta");
    } else if (selectedDestination === "internasional") {
      matchesDestination = !hotel.lokasi.toLowerCase().includes("bali") &&
                          !hotel.lokasi.toLowerCase().includes("jakarta") &&
                          !hotel.lokasi.toLowerCase().includes("indonesia");
    }

    return matchesSearch && matchesDestination;
  });

  const handleBook = (hotel: Hotel) => {
    onBook({
      hotelName: hotel.nama,
      city: hotel.lokasi,
      image: hotel.gambar,
      checkIn: "",
      checkOut: "",
      price: `Rp ${hotel.harga_per_malam.toLocaleString('id-ID')}`,
      guests: 1,
      nights: 1,
      rating: parseFloat(hotel.rating),
      roomType: "Standard Room",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-[#e5e7eb]">Loading hotels...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[#e5e7eb] mb-2">Cari Hotel</h2>
        <p className="text-gray-400">
          Temukan hotel sempurna untuk perjalanan Anda
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-[#1a1c23] rounded-xl p-4 border border-gray-700 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search Input */}
          <div className="flex items-center gap-3 bg-[#0f1117] rounded-lg px-3 py-2 border border-gray-700">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari hotel atau destinasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-[#e5e7eb] placeholder-gray-500 flex-1"
            />
          </div>

          {/* Destination Filter */}
          <div className="flex items-center gap-3 bg-[#0f1117] rounded-lg px-3 py-2 border border-gray-700">
            <MapPin className="w-5 h-5 text-gray-400" />
            <select
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
              className="bg-transparent border-none outline-none text-[#e5e7eb] flex-1 cursor-pointer"
            >
              {destinations.map((dest) => (
                <option key={dest.value} value={dest.value} className="bg-[#1a1c23]">
                  {dest.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mb-4">
        <p className="text-gray-400">
          Menampilkan {filteredHotels.length} hotel
        </p>
      </div>

      {filteredHotels.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHotels.map((hotel) => (
            <BookingCard
              key={hotel.id}
              hotelName={hotel.nama}
              city={hotel.lokasi}
              image={hotel.gambar}
              checkIn=""
              checkOut=""
              price={`Rp ${hotel.harga_per_malam.toLocaleString('id-ID')}`}
              onViewDetails={() => onViewDetails(hotel)}
              onBook={() => handleBook(hotel)}
              onWishlist={() => onWishlist(hotel)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-[#1a1c23] rounded-xl p-12 text-center border border-gray-700">
          <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-[#e5e7eb] mb-2">Tidak Ada Hotel Ditemukan</h3>
          <p className="text-gray-400">
            Coba ubah kata kunci pencarian atau filter Anda
          </p>
        </div>
      )}
    </div>
  );
}
