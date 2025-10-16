import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { ImageWithFallback } from "../../components/fallback/ImageWithFallback";
import { Star, MapPin } from "lucide-react";

const featuredHotels = [
  {
    id: 1,
    name: "Grand Palace Hotel",
    location: "Jakarta Pusat, Jakarta",
    price: 850000,
    rating: 4.8,
    reviews: 1250,
    description: "Hotel mewah di pusat kota dengan fasilitas kelas dunia dan pemandangan kota yang menakjubkan.",
    image: "https://images.unsplash.com/photo-1634041441461-a1789d008830?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3V0aXF1ZSUyMGhvdGVsJTIwZXh0ZXJpb3J8ZW58MXx8fHwxNzU5ODYyOTgwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    featured: true
  },
  {
    id: 2,
    name: "Ocean View Resort",
    location: "Seminyak, Bali",
    price: 650000,
    rating: 4.6,
    reviews: 890,
    description: "Resort tepi pantai dengan akses pantai pribadi, kolam renang, dan restoran kelas dunia.",
    image: "https://images.unsplash.com/photo-1729605412104-24acd08bd413?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMHJlc29ydCUyMGhvdGVsfGVufDF8fHx8MTc1OTg5MDU5NXww&ixlib=rb-4.1.0&q=80&w=1080",
    featured: false
  },
  {
    id: 3,
    name: "Mountain Lodge Retreat",
    location: "Bandung, Jawa Barat",
    price: 750000,
    rating: 4.7,
    reviews: 670,
    description: "Penginapan pegunungan yang nyaman dengan pemandangan gunung yang menakjubkan.",
    image: "https://images.unsplash.com/photo-1722409195473-d322e99621e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjByZXNvcnQlMjBwb29sfGVufDF8fHx8MTc1OTkyNTAzMnww&ixlib=rb-4.1.0&q=80&w=1080",
    featured: false
  },
  {
    id: 4,
    name: "Downtown Business Hotel",
    location: "Surabaya, Jawa Timur",
    price: 550000,
    rating: 4.4,
    reviews: 1100,
    description: "Hotel bisnis modern yang sempurna untuk para pebisnis dengan fasilitas canggih.",
    image: "https://images.unsplash.com/photo-1655292912612-bb5b1bda9355?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3RlbCUyMHJvb218ZW58MXx8fHwxNzU5ODk4NjcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    featured: false
  },
  {
    id: 5,
    name: "Historic Boutique Inn",
    location: "Yogyakarta, DIY",
    price: 700000,
    rating: 4.9,
    reviews: 450,
    description: "Hotel butik menawan di gedung bersejarah dengan layanan personal dan karakter unik.",
    image: "https://images.unsplash.com/photo-1729268156476-65e2f05f883d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwaG90ZWwlMjBza3lsaW5lfGVufDF8fHx8MTc1OTg5OTk1OXww&ixlib=rb-4.1.0&q=80&w=1080",
    featured: true
  }
];

export default function FeaturedHotels() {
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
          {featuredHotels.map((hotel) => (
            <Card key={hotel.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group bg-card border-border">
              <div className="relative">
                <ImageWithFallback
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {hotel.featured && (
                  <Badge className="absolute top-3 left-3 bg-primary hover:bg-primary text-white">
                    Unggulan
                  </Badge>
                )}
                <div className="absolute top-3 right-3 bg-card border border-border rounded-lg px-2 py-1 flex items-center gap-1">
                  <Star size={14} className="fill-accent text-accent" />
                  <span className="text-sm text-foreground">{hotel.rating}</span>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg text-foreground">{hotel.name}</h3>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                      <MapPin size={14} />
                      {hotel.location}
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {hotel.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl text-foreground">Rp{hotel.price.toLocaleString('id-ID')}</span>
                      <span className="text-muted-foreground text-sm">/malam</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        {hotel.reviews} ulasan
                      </div>
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
