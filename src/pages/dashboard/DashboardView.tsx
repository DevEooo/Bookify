import { Banner } from "./Banner";
import { StatCard } from "./StatCard";
import { BookingCard } from "./BookingCard";
import { Calendar, Heart, CreditCard, Clock } from "lucide-react";

interface DashboardViewProps {
  stats: any[];
  upcomingBookings: any[];
  pastBookings: any[];
  onViewDetails: (booking: any) => void;
  onBook: (booking: any) => void;
  onWishlist: (hotel: any) => void;
}

export function DashboardView({
  stats,
  upcomingBookings,
  pastBookings,
  onViewDetails,
  onBook,
  onWishlist,
}: DashboardViewProps) {
  return (
    <>
      {/* Banner Section */}
      <div className="mb-6">
        <Banner />
      </div>

      {/* Stats Section */}
      <div className="mb-6">
        <h2 className="text-[#e5e7eb] mb-3">Statistik Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              icon={stat.icon}
              label={stat.label}
              value={stat.value}
              color={stat.color}
            />
          ))}
        </div>
      </div>

      {/* Upcoming Trips */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[#e5e7eb]">Perjalanan Mendatang</h2>
          <button className="text-[#3b82f6] hover:text-blue-400 transition-colors text-sm">
            Lihat Semua
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingBookings.map((booking, index) => (
            <BookingCard
              key={index}
              hotelName={booking.hotelName}
              city={booking.city}
              image={booking.image}
              checkIn={booking.checkIn}
              checkOut={booking.checkOut}
              price={booking.price}
              onViewDetails={() => onViewDetails(booking)}
              onBook={() => onBook(booking)}
              onWishlist={() => onWishlist(booking)}
            />
          ))}
        </div>
      </div>

      {/* Past Stays */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[#e5e7eb]">Riwayat Menginap</h2>
          <button className="text-[#3b82f6] hover:text-blue-400 transition-colors text-sm">
            Lihat Semua
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastBookings.map((booking, index) => (
            <BookingCard
              key={index}
              hotelName={booking.hotelName}
              city={booking.city}
              image={booking.image}
              checkIn={booking.checkIn}
              checkOut={booking.checkOut}
              price={booking.price}
              status="past"
              onViewDetails={() => onViewDetails(booking)}
              onBook={() => onBook(booking)}
            />
          ))}
        </div>
      </div>
    </>
  );
}
