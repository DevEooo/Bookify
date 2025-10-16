import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card } from "../../components/ui/card";
import { ImageWithFallback } from "../../components/fallback/ImageWithFallback";
import { MapPin, Calendar, Users, Search, Minus, Plus, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function Hero() {
  // Dapatkan tanggal hari ini dalam format YYYY-MM-DD
  const hariIni = new Date().toISOString().split('T')[0];
  
  // State untuk form pencarian
  const [tanggalCheckIn, setTanggalCheckIn] = useState("");
  const [tanggalCheckOut, setTanggalCheckOut] = useState("");
  const [jumlahMalam, setJumlahMalam] = useState(0);
  const [jumlahKamar, setJumlahKamar] = useState(0);
  const [jumlahDewasa, setJumlahDewasa] = useState(0);
  const [jumlahAnak, setJumlahAnak] = useState(0);
  const [tamuDropdownTerbuka, setTamuDropdownTerbuka] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Hitung jumlah malam antara check-in dan check-out
  useEffect(() => {
    if (tanggalCheckIn && tanggalCheckOut) {
      const tanggalMulai = new Date(tanggalCheckIn);
      const tanggalAkhir = new Date(tanggalCheckOut);
      const selisihWaktu = tanggalAkhir.getTime() - tanggalMulai.getTime();
      const selisihMalam = Math.ceil(selisihWaktu / (1000 * 3600 * 24));
      setJumlahMalam(selisihMalam > 0 ? selisihMalam : 0);
    } else {
      setJumlahMalam(0);
    }
  }, [tanggalCheckIn, tanggalCheckOut]);

  // Tutup dropdown ketika klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setTamuDropdownTerbuka(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const tambah = (setter: React.Dispatch<React.SetStateAction<number>>, nilai: number, maksimal = 99) => {
    if (nilai < maksimal) setter(nilai + 1);
  };

  const kurang = (setter: React.Dispatch<React.SetStateAction<number>>, nilai: number, minimal = 0) => {
    if (nilai > minimal) setter(nilai - 1);
  };

  const dapatkanRingkasanTamu = () => {
    const totalTamu = jumlahDewasa + jumlahAnak;
    if (jumlahKamar === 0 && totalTamu === 0) {
      return "Pilih tamu & kamar";
    }
    const bagian = [];
    if (jumlahKamar > 0) bagian.push(`${jumlahKamar} Kamar`);
    if (totalTamu > 0) bagian.push(`${totalTamu} Tamu`);
    return bagian.join(", ");
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-16 pb-24">
      {/* Gambar Latar Belakang */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMGxvYmJ5fGVufDB8fHx8MTcyODM4NDAwMHww&ixlib=rb-4.0.3&q=80&w=1920"
          alt="Luxury Hotel Lobby"
          className="w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Konten */}
      <div className="relative z-10 text-center text-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <h1 className="text-4xl md:text-6xl mb-6">
          Temukan Penginapan Sempurna Anda
        </h1>
        <p className="text-xl md:text-2xl mb-12 text-gray-200">
          Cari hotel nyaman dan terjangkau untuk perjalanan Anda
        </p>

        {/* Form Pencarian */}
        <Card className="max-w-5xl mx-auto p-6 md:p-8 shadow-2xl bg-card border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Tujuan */}
            <div className="space-y-2">
              <Label htmlFor="tujuan" className="flex items-center gap-2 text-card-foreground">
                <MapPin size={16} className="text-primary" />
                Tujuan
              </Label>
              <Input
                id="tujuan"
                placeholder="Mau ke mana?"
                className="bg-input-background border-border text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
              />
            </div>

            {/* Tanggal Check-in */}
            <div className="space-y-2">
              <Label htmlFor="checkin" className="flex items-center gap-2 text-card-foreground">
                <Calendar size={16} className="text-primary" />
                Check-in
              </Label>
              <div className="relative">
                <Input
                  id="checkin"
                  type="date"
                  value={tanggalCheckIn}
                  onChange={(e) => setTanggalCheckIn(e.target.value)}
                  min={hariIni}
                  className="bg-input-background border-border text-card-foreground focus:border-primary focus:ring-primary [color-scheme:dark] cursor-pointer date-input pl-10"
                />
                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Tanggal Check-out */}
            <div className="space-y-2">
              <Label htmlFor="checkout" className="flex items-center gap-2 text-card-foreground">
                <Calendar size={16} className="text-primary" />
                Check-out
              </Label>
              <div className="relative">
                <Input
                  id="checkout"
                  type="date"
                  value={tanggalCheckOut}
                  onChange={(e) => setTanggalCheckOut(e.target.value)}
                  min={tanggalCheckIn || hariIni}
                  className="bg-input-background border-border text-card-foreground focus:border-primary focus:ring-primary [color-scheme:dark] cursor-pointer date-input pl-10"
                />
                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
              {jumlahMalam > 0 && (
                <div className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-1 rounded-md w-fit">
                  <Calendar size={12} />
                  <span>{jumlahMalam} malam</span>
                </div>
              )}
            </div>

            {/* Tamu & Kamar */}
            <div className="space-y-2 relative" ref={dropdownRef}>
              <Label className="flex items-center gap-2 text-card-foreground">
                <Users size={16} className="text-primary" />
                Tamu & Kamar
              </Label>
              <button
                type="button"
                onClick={() => setTamuDropdownTerbuka(!tamuDropdownTerbuka)}
                className="w-full flex items-center justify-between px-3 py-2 bg-input-background border border-border rounded-md text-card-foreground hover:bg-muted transition-colors"
              >
                <span className="text-sm">{dapatkanRingkasanTamu()}</span>
                <ChevronDown size={16} className={`transition-transform ${tamuDropdownTerbuka ? 'rotate-180' : ''}`} />
              </button>

              {/* Konten Dropdown */}
              {tamuDropdownTerbuka && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg p-4 space-y-4 z-50">
                  {/* Kamar */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-card-foreground text-sm">Kamar</p>
                      <p className="text-xs text-muted-foreground">Jumlah kamar</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 border-border bg-input-background hover:bg-muted"
                        onClick={() => kurang(setJumlahKamar, jumlahKamar, 0)}
                        disabled={jumlahKamar <= 0}
                      >
                        <Minus size={16} />
                      </Button>
                      <span className="w-8 text-center text-card-foreground">{jumlahKamar}</span>
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 border-border bg-input-background hover:bg-muted"
                        onClick={() => tambah(setJumlahKamar, jumlahKamar, 10)}
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  </div>

                  {/* Dewasa */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-card-foreground text-sm">Dewasa</p>
                      <p className="text-xs text-muted-foreground">Usia 18+</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 border-border bg-input-background hover:bg-muted"
                        onClick={() => kurang(setJumlahDewasa, jumlahDewasa, 0)}
                        disabled={jumlahDewasa <= 0}
                      >
                        <Minus size={16} />
                      </Button>
                      <span className="w-8 text-center text-card-foreground">{jumlahDewasa}</span>
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 border-border bg-input-background hover:bg-muted"
                        onClick={() => tambah(setJumlahDewasa, jumlahDewasa, 20)}
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  </div>

                  {/* Anak-anak */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-card-foreground text-sm">Anak-anak</p>
                      <p className="text-xs text-muted-foreground">Usia 0-17</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 border-border bg-input-background hover:bg-muted"
                        onClick={() => kurang(setJumlahAnak, jumlahAnak, 0)}
                        disabled={jumlahAnak <= 0}
                      >
                        <Minus size={16} />
                      </Button>
                      <span className="w-8 text-center text-card-foreground">{jumlahAnak}</span>
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 border-border bg-input-background hover:bg-muted"
                        onClick={() => tambah(setJumlahAnak, jumlahAnak, 20)}
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  </div>

                  {/* Tombol Selesai */}
                  <Button
                    type="button"
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                    onClick={() => setTamuDropdownTerbuka(false)}
                  >
                    Selesai
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Tombol Cari */}
          <div className="mt-8">
            <Button size="lg" className="w-full md:w-auto md:min-w-[400px] bg-primary hover:bg-primary/90 text-white px-16 py-6 shadow-lg shadow-primary/30">
              <Search size={20} className="mr-2" />
              Cari Hotel
            </Button>
          </div>
        </Card>

        {/* Pratinjau Gambar Hotel */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <div className="rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHJvb218ZW58MHx8fHwxNzI4Mzg0MDAwfDA&ixlib=rb-4.0.3&q=80&w=400"
              alt="Hotel Room"
              className="w-full h-32 md:h-40 object-cover"
            />
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHBvb2x8ZW58MHx8fHwxNzI4Mzg0MDAwfDA&ixlib=rb-4.0.3&q=80&w=400"
              alt="Hotel Pool"
              className="w-full h-32 md:h-40 object-cover"
            />
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1445019980597-93fa8acb246c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHJlc3RhdXJhbnR8ZW58MHx8fHwxNzI4Mzg0MDAwfDA&ixlib=rb-4.0.3&q=80&w=400"
              alt="Hotel Restaurant"
              className="w-full h-32 md:h-40 object-cover"
            />
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1568495248636-6432b97bd949?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMGJ1aWxkaW5nfGVufDB8fHx8MTcyODM4NDAwMHww&ixlib=rb-4.0.3&q=80&w=400"
              alt="Hotel Building"
              className="w-full h-32 md:h-40 object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
