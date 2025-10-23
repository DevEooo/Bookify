import { useState, useEffect } from "react";
import { fetchHotels, fetchStats, fetchFavorites, addToFavorites, removeFromFavorites, isFavorite, addToHistory, fetchHistory, fetchPaymentMethods, addPaymentMethod, updatePaymentMethod, deletePaymentMethod, setDefaultPaymentMethod, fetchCartItems, removeFromCart, updateCartItem, clearCart, type Hotel, type Stats, type Favorite, type PaymentMethod as FirestorePaymentMethod, type CartItem as FirestoreCartItem } from "../../../function/utilities/firestoreUtils";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../function/config/FirebaseConfig";
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

        // Load user data if logged in
        if (user) {
          const [userFavorites, userHistory, userPaymentMethods, userCartItems] = await Promise.all([
            fetchFavorites(user.uid),
            fetchHistory(user.uid),
            fetchPaymentMethods(user.uid),
            fetchCartItems(user.uid)
          ]);
          setFavorites(userFavorites);
          setHistoryItems(userHistory.map(item => ({
            ...item,
            totalPaid: `Rp ${item.totalPaid.toLocaleString('id-ID')}`
          })));
          setPaymentMethods(userPaymentMethods.map(method => ({
            id: method.id,
            type: method.type,
            isDefault: method.isDefault,
            cardNumber: method.cardNumber,
            cardExpiry: method.cardExpiry,
            cardName: method.cardName,
            eWalletType: method.eWalletType,
            phoneNumber: method.phoneNumber,
            bankName: method.bankName,
          })));
          setCartItems(userCartItems.map(item => ({
            id: item.id,
            hotelName: item.hotelName,
            city: item.city,
            image: item.image,
            checkIn: item.checkIn,
            checkOut: item.checkOut,
            price: item.price,
            rating: item.rating,
            guests: item.guests,
            nights: item.nights,
            totalPrice: item.totalPrice,
            roomType: item.roomType,
            checkInDate: item.checkInDate ? new Date(item.checkInDate) : undefined,
            checkOutDate: item.checkOutDate ? new Date(item.checkOutDate) : undefined,
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

  // Get 3 random hotels for recommendations
  const getRandomHotels = (hotels: Hotel[], count: number) => {
    const shuffled = [...hotels].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const recommendations = getRandomHotels(hotels, 3).map(hotel => ({
    hotelName: hotel.nama,
    city: hotel.lokasi,
    image: hotel.gambar,
    checkIn: "",
    checkOut: "",
    price: `Rp ${hotel.harga_per_malam.toLocaleString('id-ID')}`,
    rating: parseFloat(hotel.rating),
    guests: 1,
    roomType: "Standard Room",
  }));

  // Get top 3 highest rated hotels
  const highestRatedHotels = [...hotels]
    .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
    .slice(0, 3)
    .map(hotel => ({
      hotelName: hotel.nama,
      city: hotel.lokasi,
      image: hotel.gambar,
      checkIn: "",
      checkOut: "",
      price: `Rp ${hotel.harga_per_malam.toLocaleString('id-ID')}`,
      rating: parseFloat(hotel.rating),
      guests: 1,
      roomType: "Standard Room",
    }));

  const handleViewDetails = (booking: any) => {
    // If booking is a hotel object (from SearchHotelsView), enrich it with description
    if (booking.nama) {
      const hotel = hotels.find((h: Hotel) => h.id === booking.id) || booking;
      setSelectedBooking({
        hotelName: hotel.nama,
        city: hotel.lokasi,
        image: hotel.gambar,
        checkIn: booking.checkIn || "",
        checkOut: booking.checkOut || "",
        price: `Rp ${hotel.harga_per_malam.toLocaleString('id-ID')}`,
        rating: parseFloat(hotel.rating),
        guests: booking.guests || 1,
        roomType: booking.roomType || "Standard Room",
        description: hotel.deskripsi,
      });
    } else {
      // For existing booking objects, try to find the hotel description
      const hotel = hotels.find((h: Hotel) => h.nama === booking.hotelName);
      setSelectedBooking({
        ...booking,
        description: hotel?.deskripsi,
      });
    }
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

  const handleAddToCart = async (booking: any) => {
    if (!user) {
      toast.error("Please login to add to cart");
      return;
    }

    // Handle both hotel objects (from SearchHotelsView) and booking objects (from DashboardView)
    const isHotelObject = booking.nama !== undefined;
    const hotelName = isHotelObject ? booking.nama : booking.hotelName;
    const city = isHotelObject ? booking.lokasi : booking.city;
    const image = isHotelObject ? booking.gambar : booking.image;
    const price = isHotelObject ? `Rp ${booking.harga_per_malam.toLocaleString('id-ID')}` : booking.price;
    const rating = isHotelObject ? parseFloat(booking.rating) : booking.rating;

    // Check if item already exists in cart
    const existingItem = cartItems.find(item => item.hotelName === hotelName);

    if (existingItem) {
      toast.info(`${hotelName} sudah ada di Pemesanan Saya`, {
        duration: 2000,
      });
    } else {
      const guests = booking.guests || 1;
      const nights = booking.nights || 1;
      const pricePerNight = parseInt(price.replace(/[^0-9]/g, ''));
      const totalPrice = pricePerNight * guests * nights;

      const cartItem: Omit<FirestoreCartItem, 'id' | 'userId'> = {
        hotelName,
        city,
        image,
        checkIn: booking.checkIn || "",
        checkOut: booking.checkOut || "",
        price,
        rating,
        guests,
        nights,
        totalPrice: `Rp ${totalPrice.toLocaleString('id-ID')}`,
        roomType: booking.roomType || "Standard Room",
        checkInDate: booking.checkInDate,
        checkOutDate: booking.checkOutDate,
      };

      try {
        await addDoc(collection(db, "Cart"), {
          userId: user.uid,
          ...cartItem,
          createdAt: new Date(),
        });
        // Reload cart items from Firestore
        const updatedCartItems = await fetchCartItems(user.uid);
        setCartItems(updatedCartItems.map(item => ({
          id: item.id,
          hotelName: item.hotelName,
          city: item.city,
          image: item.image,
          checkIn: item.checkIn,
          checkOut: item.checkOut,
          price: item.price,
          rating: item.rating,
          guests: item.guests,
          nights: item.nights,
          totalPrice: item.totalPrice,
          roomType: item.roomType,
          checkInDate: item.checkInDate ? new Date(item.checkInDate) : undefined,
          checkOutDate: item.checkOutDate ? new Date(item.checkOutDate) : undefined,
        })));
        setActiveView("bookings");

        toast.success(`${hotelName} ditambahkan ke Pemesanan Saya!`, {
          description: "Silakan lanjutkan untuk memesan",
          duration: 3000,
        });
      } catch (error) {
        console.error("Error adding to cart:", error);
        toast.error("Failed to add to cart");
      }
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

  const handleRemoveFromCart = async (id: string) => {
    if (!user) {
      toast.error("Please login to remove from cart");
      return;
    }

    try {
      await removeFromCart(user.uid, id);
      setCartItems(cartItems.filter(item => item.id !== id));
      toast.success("Item dihapus dari Pemesanan Saya", {
        duration: 2000,
      });
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Failed to remove from cart");
    }
  };

  const handleUpdateCartItem = async (id: string, updates: Partial<CartItem>) => {
    if (!user) {
      toast.error("Please login to update cart");
      return;
    }

    try {
      await updateCartItem(user.uid, id, updates);
      setCartItems(cartItems.map(item =>
        item.id === id ? { ...item, ...updates } : item
      ));
    } catch (error) {
      console.error("Error updating cart item:", error);
      toast.error("Failed to update cart item");
    }
  };

  const handleAddPaymentMethod = async (method: PaymentMethod) => {
    if (!user) {
      toast.error("Please login to add payment method");
      return;
    }

    try {
      await addPaymentMethod(user.uid, method);
      setPaymentMethods([...paymentMethods, method]);
      toast.success("Metode pembayaran berhasil ditambahkan", {
        duration: 2000,
      });
    } catch (error) {
      console.error("Error adding payment method:", error);
      toast.error("Failed to add payment method");
    }
  };

  const handleUpdatePaymentMethod = async (id: string, updatedMethod: PaymentMethod) => {
    if (!user) {
      toast.error("Please login to update payment method");
      return;
    }

    try {
      await updatePaymentMethod(user.uid, id, updatedMethod);
      setPaymentMethods(paymentMethods.map(method =>
        method.id === id ? updatedMethod : method
      ));
      toast.success("Metode pembayaran berhasil diperbarui", {
        duration: 2000,
      });
    } catch (error) {
      console.error("Error updating payment method:", error);
      toast.error("Failed to update payment method");
    }
  };

  const handleDeletePaymentMethod = async (id: string) => {
    if (!user) {
      toast.error("Please login to delete payment method");
      return;
    }

    try {
      await deletePaymentMethod(user.uid, id);
      setPaymentMethods(paymentMethods.filter(method => method.id !== id));
      toast.success("Metode pembayaran berhasil dihapus", {
        duration: 2000,
      });
    } catch (error) {
      console.error("Error deleting payment method:", error);
      toast.error("Failed to delete payment method");
    }
  };

  const handleSetDefaultPaymentMethod = async (id: string) => {
    if (!user) {
      toast.error("Please login to set default payment method");
      return;
    }

    try {
      await setDefaultPaymentMethod(user.uid, id);
      setPaymentMethods(paymentMethods.map(method => ({
        ...method,
        isDefault: method.id === id,
      })));
      toast.success("Metode pembayaran default berhasil diubah", {
        duration: 2000,
      });
    } catch (error) {
      console.error("Error setting default payment method:", error);
      toast.error("Failed to set default payment method");
    }
  };

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <DashboardView
            stats={stats}
            recommendations={recommendations}
            highestRatedHotels={highestRatedHotels}
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
        onManageBooking={(booking) => {
          // Add the selected booking to cart and navigate to bookings page
          handleAddToCart(booking);
        }}
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
