import { useState } from "react";
import { X, Calendar as CalendarIcon, Users, Plus, Minus, Trash2 } from "lucide-react";
import { ImageWithFallback } from "../../components/fallback/ImageWithFallback";
import { Calendar } from "../../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface CartItemDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
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
  };
  onUpdate: (updates: { guests: number; nights: number; totalPrice: string; checkInDate: Date; checkOutDate: Date }) => void;
  onRemove: () => void;
  onProceedToPayment: () => void;
}

// Helper function to parse price string and calculate total
function calculateTotalPrice(priceStr: string, guests: number, nights: number): string {
  const numericPrice = parseInt(priceStr.replace(/[^0-9]/g, ''));
  const total = numericPrice * guests * nights;
  return `Rp ${total.toLocaleString('id-ID')}`;
}

// Helper function to calculate nights between two dates
function calculateNightsBetweenDates(startDate: Date, endDate: Date): number {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function CartItemDetailsModal({ isOpen, onClose, item, onUpdate, onRemove, onProceedToPayment }: CartItemDetailsModalProps) {
  const [guests, setGuests] = useState(item.guests || 1);
  const [checkInDate, setCheckInDate] = useState<Date>(new Date());
  const [checkOutDate, setCheckOutDate] = useState<Date>(new Date(Date.now() + 86400000 * (item.nights || 1)));

  const nights = calculateNightsBetweenDates(checkInDate, checkOutDate);
  const totalPrice = calculateTotalPrice(item.price, guests, nights);

  const handleGuestsChange = (delta: number) => {
    const newGuests = Math.max(1, guests + delta);
    setGuests(newGuests);
  };

  const handleDateChange = (newCheckIn?: Date, newCheckOut?: Date) => {
    if (newCheckIn) setCheckInDate(newCheckIn);
    if (newCheckOut) setCheckOutDate(newCheckOut);
  };

  const handleSaveAndProceed = () => {
    const cin = checkInDate;
    const cout = checkOutDate;
    const newNights = calculateNightsBetweenDates(cin, cout);
    const newTotal = calculateTotalPrice(item.price, guests, newNights);
    
    onUpdate({
      guests,
      nights: newNights,
      totalPrice: newTotal,
      checkInDate: cin,
      checkOutDate: cout,
    });
    
    onClose();
  };

  const handleProceedToPayment = () => {
    handleSaveAndProceed();
    onProceedToPayment();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1c23] rounded-xl max-w-2xl w-full border border-gray-700 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 sticky top-0 bg-[#1a1c23] z-10">
          <h3 className="text-[#e5e7eb]">Detail Pemesanan</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-[#e5e7eb] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Hotel Image and Name */}
          <div className="flex gap-4 mb-6">
            <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
              <ImageWithFallback
                src={item.image}
                alt={item.hotelName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="text-[#e5e7eb] mb-2">{item.hotelName}</h4>
              <p className="text-gray-400 text-sm">{item.city}</p>
            </div>
          </div>

          {/* Date Selection */}
          <div className="space-y-3 mb-6">
            <h5 className="text-[#e5e7eb] text-sm mb-3">Pilih Tanggal</h5>
            
            {/* Check-in Date */}
            <div className="flex items-center justify-between p-3 bg-[#0f1117] rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <CalendarIcon className="w-4 h-4" />
                <span>Check-in</span>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="text-[#e5e7eb] text-sm hover:text-[#3b82f6] transition-colors">
                    {format(checkInDate, "d MMM yyyy", { locale: id })}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-[#1a1c23] border-gray-700">
                  <Calendar
                    mode="single"
                    selected={checkInDate}
                    onSelect={(date) => date && handleDateChange(date, undefined)}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Check-out Date */}
            <div className="flex items-center justify-between p-3 bg-[#0f1117] rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <CalendarIcon className="w-4 h-4" />
                <span>Check-out</span>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="text-[#e5e7eb] text-sm hover:text-[#3b82f6] transition-colors">
                    {format(checkOutDate, "d MMM yyyy", { locale: id })}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-[#1a1c23] border-gray-700">
                  <Calendar
                    mode="single"
                    selected={checkOutDate}
                    onSelect={(date) => date && handleDateChange(undefined, date)}
                    disabled={(date) => date <= checkInDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Nights Display */}
            <div className="flex items-center justify-between p-3 bg-[#0f1117] rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <CalendarIcon className="w-4 h-4" />
                <span>Jumlah Malam</span>
              </div>
              <span className="text-[#3b82f6]">{nights} malam</span>
            </div>
          </div>

          {/* Guest Selection */}
          <div className="mb-6">
            <h5 className="text-[#e5e7eb] text-sm mb-3">Jumlah Tamu</h5>
            <div className="flex items-center justify-between p-3 bg-[#0f1117] rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Users className="w-4 h-4" />
                <span>Tamu</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleGuestsChange(-1)}
                  className="w-8 h-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-[#e5e7eb] rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={guests <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-[#e5e7eb] min-w-[2rem] text-center">{guests}</span>
                <button
                  onClick={() => handleGuestsChange(1)}
                  className="w-8 h-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-[#e5e7eb] rounded transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-[#0f1117] rounded-lg p-4 border border-gray-700 mb-6">
            <h5 className="text-[#e5e7eb] text-sm mb-3">Ringkasan Harga</h5>
            <div className="space-y-2 mb-3 pb-3 border-b border-gray-700">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Harga per orang/malam:</span>
                <span className="text-[#e5e7eb]">{item.price}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Perhitungan:</span>
                <span className="text-[#e5e7eb]">{guests} orang × {nights} malam</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#e5e7eb]">Total Harga:</span>
              <span className="text-[#3b82f6] text-xl">{totalPrice}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleProceedToPayment}
              className="flex-1 bg-[#3b82f6] text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Lanjut ke Pembayaran
            </button>
            <button
              onClick={onRemove}
              className="bg-red-500/20 text-red-400 px-4 py-3 rounded-lg hover:bg-red-500/30 transition-colors"
              title="Hapus"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
