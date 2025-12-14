import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Phone, Mail, MapPin, Menu, X, Star, Award, Users, Clock } from 'lucide-react';
import './App.css';
import Footer from './components/layouts/Footer';

// Import page components
import HomePage from './pages/HomePage-original';
import AboutPage from './pages/AboutPage-original';
import ProductsPage from './pages/ProductsPage-original';
import ClientsPage from './pages/ClientsPage-original';
import ContactPage from './pages/ContactPage-original';

// Header Component
function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-adh-surface shadow-sm border-b border-adh-stroke">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex justify-between items-center py-2 text-sm border-b border-border">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-adh-brand" />
              <span className="body-text">Dubai, UAE</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-adh-brand" />
              <span className="body-text">+971 4 123 4567</span>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <span className="body-text">Mon to Sat: 09:00 am to 05:00 pm</span>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="flex justify-between items-center py-4">
          <div className="navbar-brand">
            <a href="/" className="text-decoration-none">
              Abdulhaq Dimensions
              <div className="text-xs text-muted-foreground font-montserrat">Est. 1948</div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="body-text hover:text-adh-brand transition-colors">Home</a>
            <a href="/about" className="body-text hover:text-adh-brand transition-colors">About</a>
            <a href="/products" className="body-text hover:text-adh-brand transition-colors">Products</a>
            <a href="/clients" className="body-text hover:text-adh-brand transition-colors">Our Clients</a>
            <a href="/contact" className="body-text hover:text-adh-brand transition-colors">Contact</a>
          </nav>

          <div className="flex items-center space-x-4">
            <Button className="btn-primary hidden md:inline-flex">
              Request Quote
            </Button>
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-adh-brand"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              <a href="/" className="body-text hover:text-adh-brand transition-colors">Home</a>
              <a href="/about" className="body-text hover:text-adh-brand transition-colors">About</a>
              <a href="/products" className="body-text hover:text-adh-brand transition-colors">Products</a>
              <a href="/clients" className="body-text hover:text-adh-brand transition-colors">Our Clients</a>
              <a href="/contact" className="body-text hover:text-adh-brand transition-colors">Contact</a>
              <Button className="btn-primary w-full mt-4">
                Request Quote
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

// Use shared Footer (layouts/Footer) for consistent footer across pages

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;

