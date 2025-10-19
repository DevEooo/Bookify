import { Banner } from "./Banner";
import { StatCard } from "./Stats";
import { BookingCard } from "./CardList";
import { Calendar, Heart, CreditCard, Clock } from "lucide-react";

interface DashboardViewProps {
  stats: any[];
  upcomingBookings: any[];
  pastBookings: any[];
  onViewDetails: (booking: any) => void;
  onBook: (booking: any) => void;
  onWishlist: (hotelName: string) => void;
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
              {...booking}
              onViewDetails={() => onViewDetails(booking)}
              onBook={() => onBook(booking)}
              onWishlist={() => onWishlist(booking.hotelName)}
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
              {...booking}
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
