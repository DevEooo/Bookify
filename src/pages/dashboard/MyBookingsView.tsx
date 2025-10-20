import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { CartItemCard } from "./CartItemCard";
import { CartItemDetailsModal } from "./CartItemDetailsModal";

interface CartItem {
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
  checkInDate?: Date;
  checkOutDate?: Date;
}

interface MyBookingsViewProps {
  cartItems: CartItem[];
  onOrderItem: (item: CartItem) => void;
  onRemoveItem: (id: string) => void;
  onGoToDashboard?: () => void;
  onUpdateCartItem?: (id: string, updates: Partial<CartItem>) => void;
}

export function MyBookingsView({ cartItems, onOrderItem, onRemoveItem, onGoToDashboard, onUpdateCartItem }: MyBookingsViewProps) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const selectedItem = cartItems.find(item => item.id === selectedItemId);
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[#e5e7eb] mb-2">Pemesanan Saya</h2>
        <p className="text-gray-400">
          Kelola semua pesanan hotel Anda di sini
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-[#1a1c23] rounded-xl p-12 text-center border border-gray-700">
          <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-[#e5e7eb] mb-2">Belum Ada Pesanan</h3>
          <p className="text-gray-400 mb-6">
            Mulai tambahkan hotel yang ingin Anda pesan
          </p>
          <button
            onClick={onGoToDashboard}
            className="bg-[#3b82f6] text-white px-6 py-2.5 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Jelajahi Hotel
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <CartItemCard
              key={item.id}
              {...item}
              onViewDetails={() => setSelectedItemId(item.id)}
            />
          ))}
        </div>
      )}

      {/* Cart Item Details Modal */}
      {selectedItem && (
        <CartItemDetailsModal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItemId(null)}
          item={selectedItem}
          onUpdate={(updates) => {
            if (onUpdateCartItem) {
              onUpdateCartItem(selectedItem.id, updates);
            }
          }}
          onRemove={() => {
            onRemoveItem(selectedItem.id);
            setSelectedItemId(null);
          }}
          onProceedToPayment={() => onOrderItem(selectedItem)}
        />
      )}
    </div>
  );
}
