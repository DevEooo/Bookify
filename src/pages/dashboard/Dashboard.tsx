import { useState } from "react";
import { TopNavbar } from "./Header";
import { Sidebar } from "./Sidebar";
import { DashboardView } from "./DashboardView";
import { SearchHotelsView } from "./SearchPage";
import { MyBookingsView } from "./BookingPage";
import { BookingDetailsModal } from "./DetailModal";
import { Calendar, Heart, CreditCard, Clock, Settings } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "../../components/ui/sonner";
import { useAuth } from "../../../function/config/AuthConfig";
import "../../styles/dashboard.css";
import "../../dashboardView.css"

interface CartItem {
  id: string;
  hotelName: string;
  city: string;
  image: string;
  checkIn: string;
  checkOut: string;
  price: string;
  rating?: number;
  guests?: number;
  roomType?: string;
}

export default function App() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const username = user?.displayName || user?.email || "User";

  const stats = [
    { icon: Calendar, label: "Total Pemesanan", value: 12, color: "bg-blue-500/20 text-blue-400" },
    { icon: Clock, label: "Perjalanan Mendatang", value: 3, color: "bg-green-500/20 text-green-400" },
    { icon: Heart, label: "Hotel Favorit", value: 8, color: "bg-pink-500/20 text-pink-400" },
    { icon: CreditCard, label: "Total Pengeluaran", value: 4250, color: "bg-purple-500/20 text-purple-400" },
  ];

  const upcomingBookings = [
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
  ];

  const pastBookings = [
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
  ];

  const handleViewDetails = (booking: any) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleWishlist = (hotelName: string) => {
    toast.success(`${hotelName} ditambahkan ke favorit!`, {
      description: "Anda dapat melihatnya di halaman Favorit",
      duration: 3000,
    });
  };

  const handleAddToCart = (booking: any) => {
    // Check if item already exists in cart
    const existingItem = cartItems.find(item => item.hotelName === booking.hotelName);
    
    if (existingItem) {
      toast.info(`${booking.hotelName} sudah ada di Pemesanan Saya`, {
        duration: 2000,
      });
    } else {
      const cartItem: CartItem = {
        id: `cart-${Date.now()}`,
        ...booking,
      };
      
      setCartItems([...cartItems, cartItem]);
      setActiveView("bookings");
      
      toast.success(`${booking.hotelName} ditambahkan ke Pemesanan Saya!`, {
        description: "Silakan lanjutkan untuk memesan",
        duration: 3000,
      });
    }
  };

  const handleOrderItem = (item: any) => {
    setSelectedBooking(item);
    setIsModalOpen(true);
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    toast.success("Item dihapus dari Pemesanan Saya", {
      duration: 2000,
    });
  };

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <DashboardView
            stats={stats}
            upcomingBookings={upcomingBookings}
            pastBookings={pastBookings}
            onViewDetails={handleViewDetails}
            onBook={handleAddToCart}
            onWishlist={handleWishlist}
          />
        );
      case "search":
        return (
          <SearchHotelsView
            onViewDetails={handleViewDetails}
            onBook={handleAddToCart}
            onWishlist={handleWishlist}
          />
        );
      case "bookings":
        return (
          <MyBookingsView
            cartItems={cartItems}
            onOrderItem={handleOrderItem}
            onRemoveItem={handleRemoveFromCart}
            onGoToDashboard={() => setActiveView("dashboard")}
          />
        );
      case "wishlist":
        return (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-[#e5e7eb] mb-2">Favorit</h2>
            <p className="text-gray-400">Fitur ini akan segera hadir</p>
          </div>
        );
      case "payments":
        return (
          <div className="text-center py-12">
            <CreditCard className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-[#e5e7eb] mb-2">Pembayaran</h2>
            <p className="text-gray-400">Fitur ini akan segera hadir</p>
          </div>
        );
      case "settings":
        return (
          <div className="text-center py-12">
            <Settings className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-[#e5e7eb] mb-2">Pengaturan</h2>
            <p className="text-gray-400">Fitur ini akan segera hadir</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1117]">
      <Toaster
        position="top-right"
        theme="dark"
        toastOptions={{
          style: {
            background: '#1a1c23',
            border: '1px solid #374151',
            color: '#e5e7eb',
          },
        }}
      />
      <TopNavbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} activeView={activeView} username={username} />
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeView={activeView}
        onViewChange={setActiveView}
      />

      <main className="lg:ml-64 pt-24 px-4 pb-6">
        <div className="max-w-7xl mx-auto">
          {renderView()}
        </div>
      </main>

      <BookingDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        booking={selectedBooking}
      />
    </div>
  );
}
