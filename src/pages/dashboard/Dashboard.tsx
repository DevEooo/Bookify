import { useState, useEffect } from "react";
import { fetchHotels, fetchStats, fetchFavorites, addToFavorites, removeFromFavorites, isFavorite, addToHistory, fetchHistory, type Hotel, type Stats, type Favorite } from "../../../function/config/firestoreUtils";
import type { User } from 'firebase/auth';
import { useAuth } from "../../../function/config/AuthConfig";
import { TopNavbar } from "./TopNavbar";
import { Sidebar } from "./Sidebar";
import { DashboardView } from "./DashboardView";
import { SearchHotelsView } from "./SearchHotelsView";
import { MyBookingsView } from "./MyBookingsView";
import { PaymentMethodsView } from "./PaymentMethodsView";
import { CheckoutView } from "./CheckoutView";
import { HistoryView } from "./HistoryView";
import { FavoritesView } from "./FavoritesView";
import { BookingDetailsModal } from "./BookingDetailsModal";
import { PaymentSuccessModal } from "./PaymentSuccessModal";
import { Calendar, Heart, CreditCard, Clock, Settings, History as HistoryIcon } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "../../components/ui/sonner";
import "../../styles/dashboard.css";
import "../../dashboardView.css";

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
  nights?: number;
  totalPrice?: string;
  roomType?: string;
  checkInDate?: Date;
  checkOutDate?: Date;
}

interface PaymentMethod {
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

export default function App() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentSuccessOpen, setIsPaymentSuccessOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [historyItems, setHistoryItems] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [lastPaymentDetails, setLastPaymentDetails] = useState<{
    items: any[];
    subtotal: number;
    serviceFee: number;
    tax: number;
    total: number;
  } | null>(null);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [statsData, setStatsData] = useState<Stats | null>(null);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fetchedHotels, fetchedStats] = await Promise.all([
          fetchHotels(),
          fetchStats()
        ]);
        // Sort hotels by rating descending (highest first)
        const sortedHotels = fetchedHotels.sort((a: Hotel, b: Hotel) => parseFloat(b.rating) - parseFloat(a.rating));
        setHotels(sortedHotels);
        setStatsData(fetchedStats);

        // Load favorites and history if user is logged in
        if (user) {
          const [userFavorites, userHistory] = await Promise.all([
            fetchFavorites(user.uid),
            fetchHistory(user.uid)
          ]);
          setFavorites(userFavorites);
          setHistoryItems(userHistory.map(item => ({
            ...item,
            totalPaid: `Rp ${item.totalPaid.toLocaleString('id-ID')}`
          })));
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const stats = statsData ? [
    { icon: Calendar, label: "Total Pemesanan", value: statsData.totalBookings, color: "bg-blue-500/20 text-blue-400" },
    { icon: HistoryIcon, label: "History Pemesanan", value: statsData.upcomingTrips, color: "bg-green-500/20 text-green-400" },
    { icon: Heart, label: "Hotel Favorit", value: favorites.length, color: "bg-pink-500/20 text-pink-400" },
    { icon: CreditCard, label: "Total Pengeluaran", value: statsData.totalSpent, color: "bg-purple-500/20 text-purple-400" },
  ] : [
    { icon: Calendar, label: "Total Pemesanan", value: 0, color: "bg-blue-500/20 text-blue-400" },
    { icon: HistoryIcon, label: "History Pemesanan", value: 0, color: "bg-green-500/20 text-green-400" },
    { icon: Heart, label: "Hotel Favorit", value: favorites.length, color: "bg-pink-500/20 text-pink-400" },
    { icon: CreditCard, label: "Total Pengeluaran", value: 0, color: "bg-purple-500/20 text-purple-400" },
  ];

  // Get top 3 hotels for upcoming bookings display
  const upcomingBookings = hotels.slice(0, 3).map(hotel => ({
    hotelName: hotel.nama,
    city: hotel.lokasi,
    image: hotel.gambar,
    checkIn: "15 Des 2025",
    checkOut: "20 Des 2025",
    price: `Rp ${hotel.harga_per_malam.toLocaleString('id-ID')}`,
    rating: parseFloat(hotel.rating),
    guests: 2,
    roomType: "Deluxe Room",
  }));

  // Get next 2 hotels for past bookings display
  const pastBookings = hotels.slice(3, 5).map(hotel => ({
    hotelName: hotel.nama,
    city: hotel.lokasi,
    image: hotel.gambar,
    checkIn: "10 Sep 2025",
    checkOut: "15 Sep 2025",
    price: `Rp ${hotel.harga_per_malam.toLocaleString('id-ID')}`,
    rating: parseFloat(hotel.rating),
    guests: 2,
    roomType: "Standard Room",
  }));

  const handleViewDetails = (booking: any) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleWishlist = async (booking: any) => {
    if (!user) {
      toast.error("Please login to add favorites");
      return;
    }

    // Find the hotel from hotels array or create from booking data
    const hotel = hotels.find((h: Hotel) => h.nama === booking.hotelName) || {
      id: `temp-${booking.hotelName}`,
      nama: booking.hotelName,
      lokasi: booking.city,
      gambar: booking.image,
      harga_per_malam: parseInt((booking.price || '').replace(/[^0-9]/g, '')) || 0,
      rating: booking.rating?.toString() || '0',
      deskripsi: '',
    };

    try {
      const alreadyFavorite = await isFavorite(user.uid, hotel.id);
      if (alreadyFavorite) {
        await removeFromFavorites(user.uid, hotel.id);
        setFavorites(favorites.filter((fav: Favorite) => fav.hotelId !== hotel.id));
        toast.success(`${hotel.nama} removed from favorites!`);
      } else {
        await addToFavorites(user.uid, hotel);
        const newFavorite: Favorite = {
          id: `fav-${Date.now()}`,
          userId: user.uid,
          hotelId: hotel.id,
          hotelName: hotel.nama,
          city: hotel.lokasi,
          image: hotel.gambar,
          price: `Rp ${hotel.harga_per_malam.toLocaleString('id-ID')}`,
          rating: hotel.rating,
        };
        setFavorites([...favorites, newFavorite]);
        toast.success(`${hotel.nama} added to favorites!`, {
          description: "You can view it in the Favorites page",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast.error("Failed to update favorites");
    }
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
    // Go to checkout view
    setActiveView("checkout");
  };

  const handlePaymentSuccess = async () => {
    if (!user) {
      toast.error("Please login to save history");
      return;
    }

    // Calculate payment details
    const calculateSubtotal = () => {
      return cartItems.reduce((total, item) => {
        const price = parseInt((item.totalPrice || item.price).replace(/[^0-9]/g, ''));
        return total + price;
      }, 0);
    };

    const subtotal = calculateSubtotal();
    const serviceFee = Math.round(subtotal * 0.02);
    const tax = Math.round(subtotal * 0.11);
    const total = subtotal + serviceFee + tax;

    // Prepare payment items
    const paymentItems = cartItems.map(item => ({
      hotelName: item.hotelName,
      city: item.city,
      checkIn: item.checkInDate ? new Date(item.checkInDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : item.checkIn,
      checkOut: item.checkOutDate ? new Date(item.checkOutDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : item.checkOut,
      guests: item.guests || 1,
      nights: item.nights || 1,
      pricePerNight: item.price,
      totalPrice: item.totalPrice || item.price,
    }));

    setLastPaymentDetails({
      items: paymentItems,
      subtotal,
      serviceFee,
      tax,
      total,
    });

    // Add to history in Firestore
    const transactionId = `TRX-${Date.now().toString().slice(-8)}`;
    try {
      const historyPromises = cartItems.map(async (item) => {
        const historyItem = {
          transactionId,
          date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          hotelName: item.hotelName,
          city: item.city,
          image: item.image,
          checkIn: item.checkInDate ? new Date(item.checkInDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : item.checkIn,
          checkOut: item.checkOutDate ? new Date(item.checkOutDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : item.checkOut,
          guests: item.guests || 1,
          nights: item.nights || 1,
          totalPaid: total,
          status: "completed" as const,
        };
        await addToHistory(user.uid, historyItem);
        return historyItem;
      });

      await Promise.all(historyPromises);

      // Reload history from Firestore
      const updatedHistory = await fetchHistory(user.uid);
      setHistoryItems(updatedHistory.map(item => ({
        ...item,
        totalPaid: `Rp ${item.totalPaid.toLocaleString('id-ID')}`
      })));

      setIsPaymentSuccessOpen(true);
      setCartItems([]);
    } catch (error) {
      console.error("Error saving history:", error);
      toast.error("Failed to save booking history");
    }
  };

  const handleClosePaymentSuccess = () => {
    setIsPaymentSuccessOpen(false);
    setActiveView("history");
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    toast.success("Item dihapus dari Pemesanan Saya", {
      duration: 2000,
    });
  };

  const handleUpdateCartItem = (id: string, updates: Partial<CartItem>) => {
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const handleAddPaymentMethod = (method: PaymentMethod) => {
    setPaymentMethods([...paymentMethods, method]);
    toast.success("Metode pembayaran berhasil ditambahkan", {
      duration: 2000,
    });
  };

  const handleUpdatePaymentMethod = (id: string, updatedMethod: PaymentMethod) => {
    setPaymentMethods(paymentMethods.map(method =>
      method.id === id ? updatedMethod : method
    ));
    toast.success("Metode pembayaran berhasil diperbarui", {
      duration: 2000,
    });
  };

  const handleDeletePaymentMethod = (id: string) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
    toast.success("Metode pembayaran berhasil dihapus", {
      duration: 2000,
    });
  };

  const handleSetDefaultPaymentMethod = (id: string) => {
    setPaymentMethods(paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id,
    })));
    toast.success("Metode pembayaran default berhasil diubah", {
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
            onUpdateCartItem={handleUpdateCartItem}
          />
        );
      case "wishlist":
        return <FavoritesView />;
      case "payments":
        return (
          <PaymentMethodsView
            paymentMethods={paymentMethods}
            onAddMethod={handleAddPaymentMethod}
            onUpdateMethod={handleUpdatePaymentMethod}
            onDeleteMethod={handleDeletePaymentMethod}
            onSetDefault={handleSetDefaultPaymentMethod}
          />
        );
      case "checkout":
        return (
          <CheckoutView
            items={cartItems.map(item => ({
              id: item.id,
              hotelName: item.hotelName,
              city: item.city,
              image: item.image,
              checkIn: item.checkInDate
                ? new Date(item.checkInDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                : item.checkIn,
              checkOut: item.checkOutDate
                ? new Date(item.checkOutDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                : item.checkOut,
              guests: item.guests || 1,
              nights: item.nights || 1,
              pricePerNight: item.price,
              totalPrice: item.totalPrice || item.price,
            }))}
            savedPaymentMethods={paymentMethods}
            onBack={() => setActiveView("bookings")}
            onPaymentSuccess={handlePaymentSuccess}
          />
        );
      case "history":
        return <HistoryView historyItems={historyItems} />;
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
      <TopNavbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
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

      {lastPaymentDetails && (
        <PaymentSuccessModal
          isOpen={isPaymentSuccessOpen}
          onClose={handleClosePaymentSuccess}
          items={lastPaymentDetails.items}
          subtotal={lastPaymentDetails.subtotal}
          serviceFee={lastPaymentDetails.serviceFee}
          tax={lastPaymentDetails.tax}
          total={lastPaymentDetails.total}
        />
      )}
    </div>
  );
}
