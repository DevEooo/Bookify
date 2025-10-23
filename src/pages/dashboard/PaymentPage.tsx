import { useState } from "react";
import { CreditCard, Wallet, Building2, Edit2, Trash2, Plus, Check } from "lucide-react";

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

interface PaymentMethodsViewProps {
  paymentMethods: PaymentMethod[];
  onAddMethod: (method: PaymentMethod) => void;
  onUpdateMethod: (id: string, method: PaymentMethod) => void;
  onDeleteMethod: (id: string) => void;
  onSetDefault: (id: string) => void;
}

export function PaymentMethodsView({
  paymentMethods,
  onAddMethod,
  onUpdateMethod,
  onDeleteMethod,
  onSetDefault,
}: PaymentMethodsViewProps) {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<"credit-card" | "e-wallet" | "bank-transfer">("credit-card");

  // Form states
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardName, setCardName] = useState("");
  const [selectedEWallet, setSelectedEWallet] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedBank, setSelectedBank] = useState("");

  const resetForm = () => {
    setCardNumber("");
    setCardExpiry("");
    setCardName("");
    setSelectedEWallet("");
    setPhoneNumber("");
    setSelectedBank("");
  };

  const handleSaveNew = () => {
    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      type: selectedType,
      isDefault: paymentMethods.length === 0,
    };

    if (selectedType === "credit-card") {
      newMethod.cardNumber = cardNumber;
      newMethod.cardExpiry = cardExpiry;
      newMethod.cardName = cardName;
    } else if (selectedType === "e-wallet") {
      newMethod.eWalletType = selectedEWallet;
      newMethod.phoneNumber = phoneNumber;
    } else if (selectedType === "bank-transfer") {
      newMethod.bankName = selectedBank;
    }

    onAddMethod(newMethod);
    resetForm();
    setIsAddingNew(false);
  };

  const handleEdit = (method: PaymentMethod) => {
    setEditingId(method.id);
    setSelectedType(method.type);
    if (method.type === "credit-card") {
      setCardNumber(method.cardNumber || "");
      setCardExpiry(method.cardExpiry || "");
      setCardName(method.cardName || "");
    } else if (method.type === "e-wallet") {
      setSelectedEWallet(method.eWalletType || "");
      setPhoneNumber(method.phoneNumber || "");
    } else if (method.type === "bank-transfer") {
      setSelectedBank(method.bankName || "");
    }
  };

  const handleSaveEdit = () => {
    if (!editingId) return;

    const updatedMethod: PaymentMethod = {
      id: editingId,
      type: selectedType,
      isDefault: paymentMethods.find(m => m.id === editingId)?.isDefault || false,
    };

    if (selectedType === "credit-card") {
      updatedMethod.cardNumber = cardNumber;
      updatedMethod.cardExpiry = cardExpiry;
      updatedMethod.cardName = cardName;
    } else if (selectedType === "e-wallet") {
      updatedMethod.eWalletType = selectedEWallet;
      updatedMethod.phoneNumber = phoneNumber;
    } else if (selectedType === "bank-transfer") {
      updatedMethod.bankName = selectedBank;
    }

    onUpdateMethod(editingId, updatedMethod);
    resetForm();
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    resetForm();
    setEditingId(null);
    setIsAddingNew(false);
  };

  const getMethodIcon = (type: string) => {
    switch (type) {
      case "credit-card":
        return CreditCard;
      case "e-wallet":
        return Wallet;
      case "bank-transfer":
        return Building2;
      default:
        return CreditCard;
    }
  };

  const getMethodLabel = (method: PaymentMethod) => {
    if (method.type === "credit-card") {
      return `**** **** **** ${method.cardNumber?.slice(-4)}`;
    } else if (method.type === "e-wallet") {
      return `${method.eWalletType?.toUpperCase()} - ${method.phoneNumber}`;
    } else if (method.type === "bank-transfer") {
      return method.bankName?.toUpperCase();
    }
    return "Unknown";
  };

  const isFormValid = () => {
    if (selectedType === "credit-card") {
      return cardNumber && cardExpiry && cardName;
    } else if (selectedType === "e-wallet") {
      return selectedEWallet && phoneNumber;
    } else if (selectedType === "bank-transfer") {
      return selectedBank;
    }
    return false;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[#e5e7eb] mb-2">Metode Pembayaran</h2>
        <p className="text-gray-400">Kelola metode pembayaran Anda</p>
      </div>

      {/* Saved Payment Methods */}
      <div className="space-y-4 mb-6">
        {paymentMethods.map((method) => {
          const Icon = getMethodIcon(method.type);
          const isEditing = editingId === method.id;

          if (isEditing) {
            return (
              <div key={method.id} className="bg-[#1a1c23] rounded-xl p-6 border border-[#3b82f6]">
                <h3 className="text-[#e5e7eb] mb-4">Edit Metode Pembayaran</h3>
                {selectedType === "credit-card" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Nomor Kartu *</label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-[#0f1117] border border-gray-700 rounded-lg px-4 py-2.5 text-[#e5e7eb] placeholder-gray-500 focus:outline-none focus:border-[#3b82f6]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Tanggal Kadaluarsa *</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full bg-[#0f1117] border border-gray-700 rounded-lg px-4 py-2.5 text-[#e5e7eb] placeholder-gray-500 focus:outline-none focus:border-[#3b82f6]"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Nama Pemegang Kartu *</label>
                        <input
                          type="text"
                          placeholder="Nama sesuai kartu"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          className="w-full bg-[#0f1117] border border-gray-700 rounded-lg px-4 py-2.5 text-[#e5e7eb] placeholder-gray-500 focus:outline-none focus:border-[#3b82f6]"
                        />
                      </div>
                    </div>
                  </div>
                )}
                {selectedType === "e-wallet" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Pilih E-Wallet *</label>
                      <select
                        value={selectedEWallet}
                        onChange={(e) => setSelectedEWallet(e.target.value)}
                        className="w-full bg-[#0f1117] border border-gray-700 rounded-lg px-4 py-2.5 text-[#e5e7eb] focus:outline-none focus:border-[#3b82f6]"
                      >
                        <option value="">Pilih e-wallet</option>
                        <option value="gopay">GoPay</option>
                        <option value="ovo">OVO</option>
                        <option value="dana">DANA</option>
                        <option value="shopeepay">ShopeePay</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Nomor Telepon *</label>
                      <input
                        type="text"
                        placeholder="08xx xxxx xxxx"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full bg-[#0f1117] border border-gray-700 rounded-lg px-4 py-2.5 text-[#e5e7eb] placeholder-gray-500 focus:outline-none focus:border-[#3b82f6]"
                      />
                    </div>
                  </div>
                )}
                {selectedType === "bank-transfer" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Pilih Bank *</label>
                      <select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-full bg-[#0f1117] border border-gray-700 rounded-lg px-4 py-2.5 text-[#e5e7eb] focus:outline-none focus:border-[#3b82f6]"
                      >
                        <option value="">Pilih bank</option>
                        <option value="bca">BCA</option>
                        <option value="mandiri">Mandiri</option>
                        <option value="bni">BNI</option>
                        <option value="bri">BRI</option>
                      </select>
                    </div>
                  </div>
                )}
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleSaveEdit}
                    disabled={!isFormValid()}
                    className="flex-1 bg-[#3b82f6] text-white py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Simpan Perubahan
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-gray-700 text-[#e5e7eb] rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Batal
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div
              key={method.id}
              className="bg-[#1a1c23] rounded-xl p-4 border border-gray-700 hover:border-[#3b82f6] transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#3b82f6]/20 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[#3b82f6]" />
                  </div>
                  <div>
                    <p className="text-[#e5e7eb]">{getMethodLabel(method)}</p>
                    {method.type === "credit-card" && (
                      <p className="text-gray-400 text-sm">{method.cardName}</p>
                    )}
                    {method.isDefault && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-[#3b82f6]/20 text-[#3b82f6] text-xs rounded">
                        Default
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!method.isDefault && (
                    <button
                      onClick={() => onSetDefault(method.id)}
                      className="px-3 py-1.5 text-sm text-gray-400 hover:text-[#3b82f6] transition-colors"
                    >
                      Jadikan Default
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(method)}
                    className="p-2 text-gray-400 hover:text-[#3b82f6] transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteMethod(method.id)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Payment Method */}
      {!isAddingNew && !editingId && (
        <button
          onClick={() => setIsAddingNew(true)}
          className="w-full bg-[#1a1c23] border-2 border-dashed border-gray-700 rounded-xl p-6 text-gray-400 hover:border-[#3b82f6] hover:text-[#3b82f6] transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Metode Pembayaran Baru</span>
        </button>
      )}

      {isAddingNew && (
        <div className="bg-[#1a1c23] rounded-xl p-6 border border-[#3b82f6]">
          <h3 className="text-[#e5e7eb] mb-4">Tambah Metode Pembayaran</h3>

          {/* Payment Type Selection */}
          <div className="mb-4">
            <label className="block text-gray-400 text-sm mb-2">Tipe Pembayaran</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setSelectedType("credit-card")}
                className={`p-3 rounded-lg border transition-all ${
                  selectedType === "credit-card"
                    ? "border-[#3b82f6] bg-[#3b82f6]/10"
                    : "border-gray-700 hover:border-gray-600"
                }`}
              >
                <CreditCard className={`w-5 h-5 mx-auto mb-1 ${
                  selectedType === "credit-card" ? "text-[#3b82f6]" : "text-gray-400"
                }`} />
                <p className={`text-xs ${
                  selectedType === "credit-card" ? "text-[#3b82f6]" : "text-gray-400"
                }`}>Kartu</p>
              </button>
              <button
                onClick={() => setSelectedType("e-wallet")}
                className={`p-3 rounded-lg border transition-all ${
                  selectedType === "e-wallet"
                    ? "border-[#3b82f6] bg-[#3b82f6]/10"
                    : "border-gray-700 hover:border-gray-600"
                }`}
              >
                <Wallet className={`w-5 h-5 mx-auto mb-1 ${
                  selectedType === "e-wallet" ? "text-[#3b82f6]" : "text-gray-400"
                }`} />
                <p className={`text-xs ${
                  selectedType === "e-wallet" ? "text-[#3b82f6]" : "text-gray-400"
                }`}>E-Wallet</p>
              </button>
              <button
                onClick={() => setSelectedType("bank-transfer")}
                className={`p-3 rounded-lg border transition-all ${
                  selectedType === "bank-transfer"
                    ? "border-[#3b82f6] bg-[#3b82f6]/10"
                    : "border-gray-700 hover:border-gray-600"
                }`}
              >
                <Building2 className={`w-5 h-5 mx-auto mb-1 ${
                  selectedType === "bank-transfer" ? "text-[#3b82f6]" : "text-gray-400"
                }`} />
                <p className={`text-xs ${
                  selectedType === "bank-transfer" ? "text-[#3b82f6]" : "text-gray-400"
                }`}>Bank</p>
              </button>
            </div>
          </div>

          {/* Form Fields */}
          {selectedType === "credit-card" && (
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Nomor Kartu *</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full bg-[#0f1117] border border-gray-700 rounded-lg px-4 py-2.5 text-[#e5e7eb] placeholder-gray-500 focus:outline-none focus:border-[#3b82f6]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Tanggal Kadaluarsa *</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full bg-[#0f1117] border border-gray-700 rounded-lg px-4 py-2.5 text-[#e5e7eb] placeholder-gray-500 focus:outline-none focus:border-[#3b82f6]"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Nama Pemegang Kartu *</label>
                  <input
                    type="text"
                    placeholder="Nama sesuai kartu"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full bg-[#0f1117] border border-gray-700 rounded-lg px-4 py-2.5 text-[#e5e7eb] placeholder-gray-500 focus:outline-none focus:border-[#3b82f6]"
                  />
                </div>
              </div>
            </div>
          )}
          {selectedType === "e-wallet" && (
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Pilih E-Wallet *</label>
                <select
                  value={selectedEWallet}
                  onChange={(e) => setSelectedEWallet(e.target.value)}
                  className="w-full bg-[#0f1117] border border-gray-700 rounded-lg px-4 py-2.5 text-[#e5e7eb] focus:outline-none focus:border-[#3b82f6]"
                >
                  <option value="">Pilih e-wallet</option>
                  <option value="gopay">GoPay</option>
                  <option value="ovo">OVO</option>
                  <option value="dana">DANA</option>
                  <option value="shopeepay">ShopeePay</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Nomor Telepon *</label>
                <input
                  type="text"
                  placeholder="08xx xxxx xxxx"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-[#0f1117] border border-gray-700 rounded-lg px-4 py-2.5 text-[#e5e7eb] placeholder-gray-500 focus:outline-none focus:border-[#3b82f6]"
                />
              </div>
            </div>
          )}
          {selectedType === "bank-transfer" && (
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Pilih Bank *</label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full bg-[#0f1117] border border-gray-700 rounded-lg px-4 py-2.5 text-[#e5e7eb] focus:outline-none focus:border-[#3b82f6]"
                >
                  <option value="">Pilih bank</option>
                  <option value="bca">BCA</option>
                  <option value="mandiri">Mandiri</option>
                  <option value="bni">BNI</option>
                  <option value="bri">BRI</option>
                </select>
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSaveNew}
              disabled={!isFormValid()}
              className="flex-1 bg-[#3b82f6] text-white py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Simpan Metode Pembayaran
            </button>
            <button
              onClick={handleCancelEdit}
              className="px-4 py-2 bg-gray-700 text-[#e5e7eb] rounded-lg hover:bg-gray-600 transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
