import { Card, CardContent } from "../../components/ui/card";
import { CheckCircle, Clock, Shield, Headphones } from "lucide-react";

const features = [
  {
    icon: CheckCircle,
    title: "Pemesanan Mudah",
    description: "Proses pemesanan yang sederhana dan intuitif dengan konfirmasi instan"
  },
  {
    icon: Clock,
    title: "Dukungan 24/7",
    description: "Layanan pelanggan sepanjang waktu untuk membantu kebutuhan perjalanan Anda"
  },
  {
    icon: Shield,
    title: "Platform Aman",
    description: "Informasi pribadi dan pembayaran Anda selalu terlindungi"
  },
  {
    icon: Headphones,
    title: "Persetujuan Admin",
    description: "Semua pemesanan ditinjau dan disetujui oleh tim kami"
  }
];

export default function About() {
  return (
    <section id="about" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl mb-4 text-foreground">
            Tentang Bookify
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Platform ini membantu para wisatawan menemukan hotel dan melakukan reservasi online dengan mudah. 
            Dibangun dengan teknologi modern termasuk React dan Firebase, StayEasy menyediakan 
            pengalaman pemesanan yang mulus dengan layanan yang personal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300 bg-card border-border">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg mb-2 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 md:p-12 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl mb-4 text-foreground">
                Mengapa Memilih Bookify?
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    Pilihan hotel dan akomodasi berkualitas yang terkurasi
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    Ketersediaan real-time dan harga yang kompetitif
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    Rekomendasi personal berdasarkan preferensi Anda
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    Tim dukungan khusus untuk memastikan pengalaman perjalanan yang lancar
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-8 text-center">
              <div className="space-y-4">
                <div>
                  <div className="text-3xl text-primary">10.000+</div>
                  <div className="text-muted-foreground">Pelanggan Puas</div>
                </div>
                <div>
                  <div className="text-3xl text-primary">500+</div>
                  <div className="text-muted-foreground">Hotel Mitra</div>
                </div>
                <div>
                  <div className="text-3xl text-primary">50+</div>
                  <div className="text-muted-foreground">Kota Tersedia</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
