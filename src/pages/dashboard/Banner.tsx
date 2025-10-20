import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "../../components/fallback/ImageWithFallback";;

const bannerSlides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1729606559706-6c06d2ef1004?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxCYWxpJTIwbHV4dXJ5JTIwcmVzb3J0fGVufDF8fHx8MTc2MDI3NTM0N3ww&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Jelajahi Bali",
    description: "Penginapan mewah tropis hingga diskon 40%",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1680244116826-467f252cf503?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxKYWthcnRhJTIwY2l0eSUyMHNreWxpbmV8ZW58MXx8fHwxNzYwMTg4MjE3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Liburan Kota Jakarta",
    description: "Paket akhir pekan mulai dari Rp 1.290.000",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1702814160779-4a88cfb330c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUb2t5byUyMG1vZGVybiUyMGhvdGVsfGVufDF8fHx8MTc2MDI3NTM0N3ww&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Petualangan Tokyo",
    description: "Kenyamanan modern di jantung Jepang",
  },
];

export function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
  };

  return (
    <div className="relative h-72 rounded-xl overflow-hidden group">
      {bannerSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <ImageWithFallback
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30"></div>
          
          <div className="absolute inset-0 flex flex-col justify-center px-8">
            <h3 className="text-white text-4xl mb-2">{slide.title}</h3>
            <p className="text-gray-200 text-lg mb-4">{slide.description}</p>
            <button className="bg-[#3b82f6] text-white px-5 py-2.5 rounded-lg hover:bg-blue-600 transition-colors w-fit">
              Pesan Sekarang
            </button>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {bannerSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide ? "bg-white w-8" : "bg-white/50"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}