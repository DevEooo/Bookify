import { Button } from "../../components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import AuthModal from "./Modal";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authModalTerbuka, setAuthModalTerbuka] = useState(false);

  return (
    <>
      <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl text-primary">Bookify</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#home" className="text-foreground hover:text-primary transition-colors">
                Beranda
              </a>
              <a href="#about" className="text-foreground hover:text-primary transition-colors">
                Tentang
              </a>
              <a href="#contact" className="text-foreground hover:text-primary transition-colors">
                Kontak
              </a>
            </nav>

            {/* Desktop Sign In Button */}
            <div className="hidden md:flex items-center gap-3">
              <Button
                className="bg-primary hover:bg-primary/90 text-white"
                onClick={() => setAuthModalTerbuka(true)}
              >
                Masuk
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-foreground hover:text-primary transition-colors"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-card border-t border-border">
                <a href="#home" className="block px-3 py-2 text-foreground hover:text-primary transition-colors">
                  Beranda
                </a>
                <a href="#about" className="block px-3 py-2 text-foreground hover:text-primary transition-colors">
                  Tentang
                </a>
                <a href="#contact" className="block px-3 py-2 text-foreground hover:text-primary transition-colors">
                  Kontak
                </a>
                <div className="px-3 py-2">
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                    onClick={() => {
                      setAuthModalTerbuka(true);
                      setIsMenuOpen(false);
                    }}
                  >
                    Masuk
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal 
        terbuka={authModalTerbuka} 
        onTutup={() => setAuthModalTerbuka(false)} 
      />
    </>
  );
}
