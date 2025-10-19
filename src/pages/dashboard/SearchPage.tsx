import { Search, MapPin, Star, Users, Calendar } from "lucide-react";
import { useState } from "react";
import { BookingCard } from "./CardList";

interface SearchHotelsViewProps {
  onViewDetails: (hotel: any) => void;
  onBook: (hotel: any) => void;
  onWishlist: (hotelName: string) => void;
}

export function SearchHotelsView({ onViewDetails, onBook, onWishlist }: SearchHotelsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("all");

  const allHotels = [
    {
      hotelName: "Grand Hyatt Bali",
      city: "Bali, Indonesia",
      image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJvb218ZW58MXx8fHwxNzYwMTc0NTI2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      checkIn: "15 Des 2025",
      checkOut: "20 Des 2025",
      price: "Rp 2.500.000",
      rating: 4.8,
      guests: 2,
      roomType: "Deluxe Ocean View",
    },
    {
      hotelName: "Ocean View Resort",
      city: "Maladewa",
      image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMHJlc29ydHxlbnwxfHx8fDE3NjAxOTYzNDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      checkIn: "5 Jan 2026",
      checkOut: "12 Jan 2026",
      price: "Rp 5.800.000",
      rating: 4.9,
      guests: 2,
      roomType: "Overwater Villa",
    },
    {
      hotelName: "Mountain Lodge Retreat",
      city: "Pegunungan Alpen, Swiss",
      image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGhvdGVsfGVufDF8fHx8MTc2MDE5NTM0M3ww&ixlib=rb-4.1.0&q=80&w=1080",
      checkIn: "10 Feb 2026",
      checkOut: "17 Feb 2026",
      price: "Rp 4.200.000",
      rating: 4.7,
      guests: 4,
      roomType: "Family Suite",
    },
    {
      hotelName: "Tokyo Imperial Hotel",
      city: "Tokyo, Jepang",
      image: "https://images.unsplash.com/photo-1702814160779-4a88cfb330c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUb2t5byUyMG1vZGVybiUyMGhvdGVsfGVufDF8fHx8MTc2MDI3NTM0N3ww&ixlib=rb-4.1.0&q=80&w=1080",
      checkIn: "10 Sep 2025",
      checkOut: "15 Sep 2025",
      price: "Rp 3.500.000",
      rating: 4.6,
      guests: 2,
      roomType: "Executive Room",
    },
    {
      hotelName: "Jakarta Grand Suite",
      city: "Jakarta, Indonesia",
      image: "https://images.unsplash.com/photo-1680244116826-467f252cf503?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxKYWthcnRhJTIwY2l0eSUyMHNreWxpbmV8ZW58MXx8fHwxNzYwMTg4MjE3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      checkIn: "20 Agu 2025",
      checkOut: "25 Agu 2025",
      price: "Rp 1.800.000",
      rating: 4.5,
      guests: 1,
      roomType: "Business Suite",
    },
    {
      hotelName: "Singapore Marina Bay Hotel",
      city: "Singapura",
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaW5nYXBvcmUlMjBob3RlbHxlbnwxfHx8fDE3NjAyNzUzNDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      checkIn: "1 Mar 2026",
      checkOut: "5 Mar 2026",
      price: "Rp 3.200.000",
      rating: 4.8,
      guests: 2,
      roomType: "Skyline View Suite",
    },
    {
      hotelName: "Paris Luxury Resort",
      city: "Paris, Prancis",
      image: "https://images.unsplash.com/photo-1455587734955-081b22074882?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJpcyUyMGhvdGVsfGVufDF8fHx8MTc2MDI3NTM0N3ww&ixlib=rb-4.1.0&q=80&w=1080",
      checkIn: "15 Apr 2026",
      checkOut: "20 Apr 2026",
      price: "Rp 6.500.000",
      rating: 4.9,
      guests: 2,
      roomType: "Eiffel Tower View",
    },
    {
      hotelName: "Dubai Desert Oasis",
      city: "Dubai, UAE",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkdWJhaSUyMGx1eHVyeSUyMGhvdGVsfGVufDF8fHx8MTc2MDI3NTM0N3ww&ixlib=rb-4.1.0&q=80&w=1080",
      checkIn: "10 Mei 2026",
      checkOut: "15 Mei 2026",
      price: "Rp 7.800.000",
      rating: 4.9,
      guests: 3,
      roomType: "Royal Suite",
    },
  ];

  const destinations = [
    { value: "all", label: "Semua Destinasi" },
    { value: "bali", label: "Bali" },
    { value: "jakarta", label: "Jakarta" },
    { value: "internasional", label: "Internasional" },
  ];

  const filteredHotels = allHotels.filter((hotel) => {
    const matchesSearch = hotel.hotelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         hotel.city.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesDestination = true;
    if (selectedDestination === "bali") {
      matchesDestination = hotel.city.toLowerCase().includes("bali");
    } else if (selectedDestination === "jakarta") {
      matchesDestination = hotel.city.toLowerCase().includes("jakarta");
    } else if (selectedDestination === "internasional") {
      matchesDestination = !hotel.city.toLowerCase().includes("bali") && 
                          !hotel.city.toLowerCase().includes("jakarta") &&
                          !hotel.city.toLowerCase().includes("indonesia");
    }
    
    return matchesSearch && matchesDestination;
  });

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
          {filteredHotels.map((hotel, index) => (
            <BookingCard
              key={index}
              {...hotel}
              onViewDetails={() => onViewDetails(hotel)}
              onBook={() => onBook(hotel)}
              onWishlist={() => onWishlist(hotel.hotelName)}
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
