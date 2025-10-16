import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl text-primary">Bookify</h3>
            <p className="text-muted-foreground text-sm">
              Mitra terpercaya Anda untuk reservasi hotel. Temukan kenyamanan, 
              kemudahan, dan layanan terbaik di mana pun Anda bepergian.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg text-foreground">Tautan Cepat</h4>
            <div className="space-y-2">
              <a href="#home" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                Beranda
              </a>
              <a href="#about" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                Tentang Kami
              </a>
              <a href="#hotels" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                Hotel
              </a>
              <a href="#contact" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                Kontak
              </a>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-lg text-foreground">Dukungan</h4>
            <div className="space-y-2">
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                Pusat Bantuan
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                Syarat Layanan
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                Kebijakan Privasi
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                FAQ
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg text-foreground">Hubungi Kami</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Mail size={16} />
                <span>support@bookify.com</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Phone size={16} />
                <span>+62 21 1234 5678</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <MapPin size={16} />
                <span>Jl. Sudirman No. 123, Jakarta 12190</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2025 Bookify. Hak Cipta Dilindungi.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
              Syarat
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
              Privasi
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
