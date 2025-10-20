import { useState, useEffect } from "react";
import { Heart, MapPin, Star, Trash2 } from "lucide-react";
import { fetchFavorites, removeFromFavorites, type Favorite } from "../../../function/config/firestoreUtils";
import { useAuth } from "../../../function/config/AuthConfig";
import { ImageWithFallback } from "../../components/fallback/ImageWithFallback";
import { toast } from "sonner";

export function FavoritesView() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  const loadFavorites = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const userFavorites = await fetchFavorites(user.uid);
      setFavorites(userFavorites);
    } catch (error) {
      console.error("Error loading favorites:", error);
      toast.error("Failed to load favorites");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (favoriteId: string, hotelId: string) => {
    if (!user) return;

    try {
      await removeFromFavorites(user.uid, hotelId);
      setFavorites(favorites.filter(fav => fav.id !== favoriteId));
      toast.success("Removed from favorites");
    } catch (error) {
      console.error("Error removing favorite:", error);
      toast.error("Failed to remove from favorites");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3b82f6]"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[#e5e7eb] mb-2">Hotel Favorit</h2>
        <p className="text-gray-400">
          Daftar hotel yang Anda sukai
        </p>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((favorite) => (
            <div
              key={favorite.id}
              className="bg-[#1a1c23] rounded-xl overflow-hidden border border-gray-700 hover:border-[#3b82f6] transition-all hover:shadow-lg hover:shadow-blue-500/10 group"
            >
              <div className="relative h-48 overflow-hidden">
                <ImageWithFallback
                  src={favorite.image}
                  alt={favorite.hotelName}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <button
                  onClick={() => handleRemoveFavorite(favorite.id, favorite.hotelId)}
                  className="absolute top-3 right-3 bg-red-500/90 hover:bg-red-600 backdrop-blur-sm p-2 rounded-full transition-colors"
                  title="Remove from favorites"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
              </div>

              <div className="p-4">
                <h3 className="text-[#e5e7eb] mb-2">{favorite.hotelName}</h3>

                <div className="flex items-center gap-2 text-gray-400 text-sm mb-1.5">
                  <MapPin className="w-4 h-4" />
                  <span>{favorite.city}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{favorite.rating}</span>
                </div>

                <div className="mb-3">
                  <span className="text-[#3b82f6]">{favorite.price}</span>
                  <span className="text-gray-400 text-sm"> / malam</span>
                </div>

                <button className="w-full bg-[#3b82f6] text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
                  Pesan Sekarang
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#1a1c23] rounded-xl p-12 text-center border border-gray-700">
          <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-[#e5e7eb] mb-2">Belum Ada Hotel Favorit</h3>
          <p className="text-gray-400">
            Klik ikon hati pada hotel yang Anda sukai untuk menambahkannya ke favorit
          </p>
        </div>
      )}
    </div>
  );
}
