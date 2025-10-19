import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "../function/config/AuthConfig";
import Header from "./pages/homepage/Nav";
import Hero from "./pages/homepage/Hero";
import FeaturedHotels from "./pages/homepage/Highlight";
import About from "./pages/homepage/About";
import Footer from "./pages/homepage/Footer";
import Dashboard from "./pages/dashboard/Dashboard";

function AppContent() {
  const { user } = useAuth();

  return (
    <Router>
      <div className="dark min-h-screen">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Header />
                <main>
                  <Hero />
                  <FeaturedHotels />
                  <About />
                </main>
                <Footer />
              </>
            }
          />
          <Route
            path="/dashboard"
            element={
              user ? <Dashboard /> : <Navigate to="/" replace />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}