import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { ImageWithFallback } from "../../components/fallback/ImageWithFallback";
import { Star, MapPin } from "lucide-react";
import { fetchHotels } from "../../../function/utilities/firestoreUtils";
import type { Hotel } from "../../../function/utilities/firestoreUtils";

export default function FeaturedHotels() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHotels = async () => {
      try {
        const fetchedHotels = await fetchHotels();
        // Sort by rating descending and take top 5
        const sortedHotels = fetchedHotels
          .sort((a: Hotel, b: Hotel) => parseFloat(b.rating) - parseFloat(a.rating))
          .slice(0, 5);
        setHotels(sortedHotels);
      } catch (error) {
        console.error("Failed to fetch hotels:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHotels();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4 text-foreground">
              Hotel Unggulan
            </h2>
            <p className="text-lg text-muted-foreground">
              Memuat hotel terbaik...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl mb-4 text-foreground">
            Hotel Unggulan
          </h2>
          <p className="text-lg text-muted-foreground">
            Temukan pilihan hotel terbaik kami yang telah dikurasi khusus untuk Anda
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hotels.map((hotel) => (
            <Card key={hotel.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group bg-card border-border">
              <div className="relative">
                <ImageWithFallback
                  src={hotel.gambar}
                  alt={hotel.nama}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 bg-card border border-border rounded-lg px-2 py-1 flex items-center gap-1">
                  <Star size={14} className="fill-accent text-accent" />
                  <span className="text-sm text-foreground">{hotel.rating}</span>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg text-foreground">{hotel.nama}</h3>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                      <MapPin size={14} />
                      {hotel.lokasi}
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {hotel.deskripsi}
                  </p>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl text-foreground">Rp{hotel.harga_per_malam.toLocaleString('id-ID')}</span>
                      <span className="text-muted-foreground text-sm">/malam</span>
                    </div>
                  </div>

                  <Button className="w-full bg-primary hover:bg-primary/90 text-white mt-4">
                    Lihat Detail
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="px-8 border-border text-foreground hover:bg-surface">
            Lihat Semua Hotel
          </Button>
        </div>
      </div>
    </section>
  );
}
