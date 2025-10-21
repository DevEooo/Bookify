import { collection, getDocs, doc, getDoc, addDoc, deleteDoc, updateDoc, query, where } from "firebase/firestore";
import { db } from "../config/FirebaseConfig";

export interface Hotel {
  id: string;
  nama: string;
  lokasi: string;
  harga_per_malam: number;
  deskripsi: string;
  rating: string;
  gambar: string;
}

export const fetchHotels = async (): Promise<Hotel[]> => {
  try {
    const hotelsCollection = collection(db, "Hotel");
    const hotelsSnapshot = await getDocs(hotelsCollection);
    const hotels: Hotel[] = hotelsSnapshot.docs.map((doc) => ({
      id: doc.id,
      nama: doc.data().nama,
      lokasi: doc.data().lokasi,
      harga_per_malam: doc.data().harga_per_malam,
      deskripsi: doc.data().deskripsi,
      rating: doc.data().rating,
      gambar: doc.data().gambar,
    }));
    return hotels;
  } catch (error) {
    console.error("Error fetching hotels:", error);
    throw error;
  }
};

export interface Stats {
  totalBookings: number;
  upcomingTrips: number;
  favoriteHotels: number;
  totalSpent: number;
}

export const fetchStats = async (): Promise<Stats> => {
  try {
    const statsDoc = doc(db, "Stats", "dashboard");
    const statsSnapshot = await getDoc(statsDoc);
    if (statsSnapshot.exists()) {
      const data = statsSnapshot.data();
      return {
        totalBookings: data.totalBookings || 0,
        upcomingTrips: data.upcomingTrips || 0,
        favoriteHotels: data.favoriteHotels || 0,
        totalSpent: data.totalSpent || 0,
      };
    } else {
      // Return default values if document doesn't exist
      return {
        totalBookings: 0,
        upcomingTrips: 0,
        favoriteHotels: 0,
        totalSpent: 0,
      };
    }
  } catch (error) {
    console.error("Error fetching stats:", error);
    throw error;
  }
};

export interface Favorite {
  id: string;
  userId: string;
  hotelId: string;
  hotelName: string;
  city: string;
  image: string;
  price: string;
  rating: string;
}

export const addToFavorites = async (userId: string, hotel: Hotel): Promise<void> => {
  try {
    // Check if already favorited
    const existingQuery = query(
      collection(db, "Favorites"),
      where("userId", "==", userId),
      where("hotelId", "==", hotel.id)
    );
    const existingSnapshot = await getDocs(existingQuery);

    if (!existingSnapshot.empty) {
      throw new Error("Hotel already in favorites");
    }

    await addDoc(collection(db, "Favorites"), {
      userId,
      hotelId: hotel.id,
      hotelName: hotel.nama,
      city: hotel.lokasi,
      image: hotel.gambar,
      price: `Rp ${hotel.harga_per_malam.toLocaleString('id-ID')}`,
      rating: hotel.rating,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Error adding to favorites:", error);
    throw error;
  }
};

export const removeFromFavorites = async (userId: string, hotelId: string): Promise<void> => {
  try {
    const favoritesQuery = query(
      collection(db, "Favorites"),
      where("userId", "==", userId),
      where("hotelId", "==", hotelId)
    );
    const favoritesSnapshot = await getDocs(favoritesQuery);

    if (!favoritesSnapshot.empty) {
      await deleteDoc(favoritesSnapshot.docs[0].ref);
    }
  } catch (error) {
    console.error("Error removing from favorites:", error);
    throw error;
  }
};

export const fetchFavorites = async (userId: string): Promise<Favorite[]> => {
  try {
    const favoritesQuery = query(
      collection(db, "Favorites"),
      where("userId", "==", userId)
    );
    const favoritesSnapshot = await getDocs(favoritesQuery);
    const favorites: Favorite[] = favoritesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Favorite[];
    return favorites;
  } catch (error) {
    console.error("Error fetching favorites:", error);
    throw error;
  }
};

export const isFavorite = async (userId: string, hotelId: string): Promise<boolean> => {
  try {
    const favoritesQuery = query(
      collection(db, "Favorites"),
      where("userId", "==", userId),
      where("hotelId", "==", hotelId)
    );
    const favoritesSnapshot = await getDocs(favoritesQuery);
    return !favoritesSnapshot.empty;
  } catch (error) {
    console.error("Error checking favorite status:", error);
    return false;
  }
};

export interface HistoryItem {
  id: string;
  userId: string;
  transactionId: string;
  date: string;
  hotelName: string;
  city: string;
  image: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  totalPaid: number;
  status: "completed" | "pending" | "cancelled";
}

export const addToHistory = async (userId: string, historyItem: Omit<HistoryItem, 'id' | 'userId'>): Promise<void> => {
  try {
    await addDoc(collection(db, "History"), {
      userId,
      ...historyItem,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Error adding to history:", error);
    throw error;
  }
};

export const fetchHistory = async (userId: string): Promise<HistoryItem[]> => {
  try {
    const historyQuery = query(
      collection(db, "History"),
      where("userId", "==", userId)
    );
    const historySnapshot = await getDocs(historyQuery);
    const history: HistoryItem[] = historySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as HistoryItem[];
    return history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error("Error fetching history:", error);
    throw error;
  }
};

export interface PaymentMethod {
  id: string;
  userId: string;
  type: "credit-card" | "e-wallet" | "bank-transfer";
  isDefault: boolean;
  cardNumber?: string;
  cardExpiry?: string;
  cardName?: string;
  eWalletType?: string;
  phoneNumber?: string;
  bankName?: string;
}

export const addPaymentMethod = async (userId: string, paymentMethod: Omit<PaymentMethod, 'id' | 'userId'>): Promise<void> => {
  try {
    await addDoc(collection(db, "PaymentMethods"), {
      userId,
      ...paymentMethod,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Error adding payment method:", error);
    throw error;
  }
};

export const updatePaymentMethod = async (userId: string, methodId: string, updates: Partial<PaymentMethod>): Promise<void> => {
  try {
    const methodQuery = query(
      collection(db, "PaymentMethods"),
      where("userId", "==", userId),
      where("id", "==", methodId)
    );
    const methodSnapshot = await getDocs(methodQuery);

    if (!methodSnapshot.empty) {
      await updateDoc(methodSnapshot.docs[0].ref, {
        ...updates,
        updatedAt: new Date(),
      });
    }
  } catch (error) {
    console.error("Error updating payment method:", error);
    throw error;
  }
};

export const deletePaymentMethod = async (userId: string, methodId: string): Promise<void> => {
  try {
    const methodQuery = query(
      collection(db, "PaymentMethods"),
      where("userId", "==", userId),
      where("id", "==", methodId)
    );
    const methodSnapshot = await getDocs(methodQuery);

    if (!methodSnapshot.empty) {
      await deleteDoc(methodSnapshot.docs[0].ref);
    }
  } catch (error) {
    console.error("Error deleting payment method:", error);
    throw error;
  }
};

export const fetchPaymentMethods = async (userId: string): Promise<PaymentMethod[]> => {
  try {
    const methodsQuery = query(
      collection(db, "PaymentMethods"),
      where("userId", "==", userId)
    );
    const methodsSnapshot = await getDocs(methodsQuery);
    const methods: PaymentMethod[] = methodsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as PaymentMethod[];
    return methods;
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    throw error;
  }
};

export const setDefaultPaymentMethod = async (userId: string, methodId: string): Promise<void> => {
  try {
    // First, set all methods to non-default
    const allMethodsQuery = query(
      collection(db, "PaymentMethods"),
      where("userId", "==", userId)
    );
    const allMethodsSnapshot = await getDocs(allMethodsQuery);

    const updatePromises = allMethodsSnapshot.docs.map(doc =>
      updateDoc(doc.ref, { isDefault: false, updatedAt: new Date() })
    );
    await Promise.all(updatePromises);

    // Then set the selected method as default
    const methodQuery = query(
      collection(db, "PaymentMethods"),
      where("userId", "==", userId),
      where("id", "==", methodId)
    );
    const methodSnapshot = await getDocs(methodQuery);

    if (!methodSnapshot.empty) {
      await updateDoc(methodSnapshot.docs[0].ref, {
        isDefault: true,
        updatedAt: new Date(),
      });
    }
  } catch (error) {
    console.error("Error setting default payment method:", error);
    throw error;
  }
};

export interface CartItem {
  id: string;
  userId: string;
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

export const addToCart = async (userId: string, cartItem: Omit<CartItem, 'id' | 'userId'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "Cart"), {
      userId,
      ...cartItem,
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};

export const removeFromCart = async (userId: string, cartItemId: string): Promise<void> => {
  try {
    const cartQuery = query(
      collection(db, "Cart"),
      where("userId", "==", userId),
      where("id", "==", cartItemId)
    );
    const cartSnapshot = await getDocs(cartQuery);

    if (!cartSnapshot.empty) {
      await deleteDoc(cartSnapshot.docs[0].ref);
    }
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw error;
  }
};

export const updateCartItem = async (userId: string, cartItemId: string, updates: Partial<CartItem>): Promise<void> => {
  try {
    const cartQuery = query(
      collection(db, "Cart"),
      where("userId", "==", userId),
      where("id", "==", cartItemId)
    );
    const cartSnapshot = await getDocs(cartQuery);

    if (!cartSnapshot.empty) {
      await updateDoc(cartSnapshot.docs[0].ref, {
        ...updates,
        updatedAt: new Date(),
      });
    }
  } catch (error) {
    console.error("Error updating cart item:", error);
    throw error;
  }
};

export const fetchCartItems = async (userId: string): Promise<CartItem[]> => {
  try {
    const cartQuery = query(
      collection(db, "Cart"),
      where("userId", "==", userId)
    );
    const cartSnapshot = await getDocs(cartQuery);
    const cartItems: CartItem[] = cartSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as CartItem[];
    return cartItems;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    throw error;
  }
};

export const clearCart = async (userId: string): Promise<void> => {
  try {
    const cartQuery = query(
      collection(db, "Cart"),
      where("userId", "==", userId)
    );
    const cartSnapshot = await getDocs(cartQuery);

    const deletePromises = cartSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw error;
  }
};
