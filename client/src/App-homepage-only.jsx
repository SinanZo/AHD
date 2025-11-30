import React, { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Phone, Mail, MapPin, Menu, X, Star, Award, Users, Clock } from 'lucide-react';
import './App.css';
import { TEL_URL, WA_URL } from './config';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const services = [
    {
      title: "Curtains & Drapes",
      description: "Classic and modern curtains for residential and commercial spaces",
      features: ["Custom tailoring", "Fire-rated fabrics", "Premium materials"]
    },
    {
      title: "Blinds & Shades",
      description: "Roller blinds, venetian blinds, and specialty window treatments",
      features: ["Blackout options", "Motorized systems", "Energy efficient"]
    },
    {
      title: "Furniture Upholstery",
      description: "Professional upholstery services for all types of furniture",
      features: ["Quality fabrics", "Expert craftsmanship", "Custom designs"]
    },
    {
  title: "Wallpapers",
      description: "Specialized solutions for hotels, hospitals, and offices",
      features: ["Heavy-duty tracks", "Antibacterial fabrics", "Fire safety compliance"]
    }
  ];

  const stats = [
    { icon: <Award className="w-8 h-8" />, number: "75+", label: "Years of Excellence", subtitle: "Since 1948" },
    { icon: <Users className="w-8 h-8" />, number: "1000+", label: "Satisfied Clients", subtitle: "Residential & Commercial" },
    { icon: <Star className="w-8 h-8" />, number: "100%", label: "Quality Guarantee", subtitle: "Premium Materials" },
    { icon: <Clock className="w-8 h-8" />, number: "24/7", label: "Customer Support", subtitle: "Always Available" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-border">
        <div className="container mx-auto px-4">
          {/* Top Bar */}
          <div className="flex justify-between items-center py-2 text-sm border-b border-border">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="body-text">Dubai, UAE</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-primary" />
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
              Abdulhaq Dimensions
              <div className="text-xs text-muted-foreground font-montserrat">Est. 1948</div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#home" className="body-text hover:text-primary transition-colors">Home</a>
              <a href="#about" className="body-text hover:text-primary transition-colors">About</a>
              <a href="#services" className="body-text hover:text-primary transition-colors">Services</a>
              <a href="#products" className="body-text hover:text-primary transition-colors">Products</a>
              <a href="#clients" className="body-text hover:text-primary transition-colors">Our Clients</a>
              <a href="#contact" className="body-text hover:text-primary transition-colors">Contact</a>
            </nav>

            <div className="flex items-center space-x-4">
              <Button className="btn-primary hidden md:inline-flex">
                Request Quote
              </Button>
              <button
                onClick={toggleMenu}
                className="md:hidden p-2 text-primary"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-border">
              <nav className="flex flex-col space-y-4">
                <a href="#home" className="body-text hover:text-primary transition-colors">Home</a>
                <a href="#about" className="body-text hover:text-primary transition-colors">About</a>
                <a href="#services" className="body-text hover:text-primary transition-colors">Services</a>
                <a href="#products" className="body-text hover:text-primary transition-colors">Products</a>
                <a href="#clients" className="body-text hover:text-primary transition-colors">Our Clients</a>
                <a href="#contact" className="body-text hover:text-primary transition-colors">Contact</a>
                <Button className="btn-primary w-full mt-4">
                  Request Quote
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="hero-section text-white section-padding">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-secondary text-white">Premium Interior Solutions</Badge>
              <h1 className="text-4xl md:text-6xl font-jockey mb-6 text-shadow">
                COMPREHENSIVE PROJECT SOLUTIONS
              </h1>
              <p className="text-lg md:text-xl body-text text-white/90 mb-8 leading-relaxed">
                We offer comprehensive project solutions that cater to a wide range of requirements, 
                including private residential villas, offices, clinics, as well as large-scale projects 
                like headquarters, hotels, hospitals, and resorts.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="btn-secondary bg-white text-primary hover:bg-gray-100">
                  See Our Products
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                  Get In Touch
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 glass-effect">
                <h3 className="text-2xl font-jockey mb-4">Why Choose Us?</h3>
                <ul className="space-y-3 body-text">
                  <li className="flex items-center space-x-3">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span>75+ years of excellence since 1948</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Award className="w-5 h-5 text-yellow-400" />
                    <span>Premium accessories from Switzerland, UK & Taiwan</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-yellow-400" />
                    <span>Specialized solutions for every space</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4 text-primary">
                  {stat.icon}
                </div>
                <div className="text-3xl font-jockey text-primary mb-2">{stat.number}</div>
                <div className="font-montserrat font-semibold text-foreground">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.subtitle}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section-padding bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="section-subtitle">About Abdulhaq Dimensions</div>
              <h2 className="section-title">HOW WE WORK</h2>
              <div className="body-text space-y-4">
                <p>
                  Our expertise lies in providing an all-encompassing service, encompassing the supply, 
                  fabrication, tailoring, and installation of curtains, both classic and modern, as well 
                  as upholstery for furniture. Our commitment to excellence ensures that we uphold the 
                  highest standards and quality measures in all our offerings.
                </p>
                <p>
                  Moreover, we take pride in offering a selection of top-notch accessories, sourced from 
                  renowned suppliers in Switzerland, the United Kingdom, and Taiwan. These high-end and 
                  heavy-duty accessories are meticulously chosen to complement our range of products.
                </p>
                <p>
                  Recognizing the importance of specialization, we are well-equipped to accommodate specific 
                  fabric and accessory requirements based on the intended use of the space.
                </p>
              </div>
              <Button className="btn-primary mt-6">
                Learn More About Us
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-lg shadow-sm card-hover">
                  <h4 className="font-montserrat font-semibold text-primary mb-2">Custom Tailoring</h4>
                  <p className="text-sm body-text">Precision craftsmanship for every project</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm card-hover">
                  <h4 className="font-montserrat font-semibold text-primary mb-2">Premium Materials</h4>
                  <p className="text-sm body-text">Sourced from international suppliers</p>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="bg-white p-6 rounded-lg shadow-sm card-hover">
                  <h4 className="font-montserrat font-semibold text-primary mb-2">Expert Installation</h4>
                  <p className="text-sm body-text">Professional installation services</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm card-hover">
                  <h4 className="font-montserrat font-semibold text-primary mb-2">Quality Assurance</h4>
                  <p className="text-sm body-text">Highest standards in every project</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="section-subtitle">Our Services</div>
            <h2 className="section-title">PREMIUM SOLUTIONS</h2>
            <p className="body-text text-muted-foreground max-w-2xl mx-auto">
              From residential villas to large-scale commercial projects, we provide comprehensive 
              interior solutions tailored to your specific needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="card-hover border-border">
                <CardHeader>
                  <CardTitle className="font-montserrat text-primary">{service.title}</CardTitle>
                  <CardDescription className="body-text">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-2 text-sm body-text">
                        <Star className="w-4 h-4 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="btn-secondary w-full mt-4">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="hero-section text-white section-padding">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-jockey mb-4">Ready to Transform Your Space?</h2>
          <p className="text-lg body-text text-white/90 mb-8 max-w-2xl mx-auto">
            Contact us today for a consultation and let our experts help you create the perfect 
            interior solution for your project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100">
              <a href={WA_URL ? WA_URL() : '#'} target="_blank" rel="noopener noreferrer" aria-label="Request a quote via WhatsApp">Request a Quote</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              <a href={TEL_URL || '#'} aria-label="Call us now"><Phone className="w-4 h-4 mr-2" aria-hidden="true" />Call Us Now</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="navbar-brand text-white mb-4">
                Abdulhaq Dimensions
                <div className="text-xs text-white/70 font-montserrat">Est. 1948</div>
              </div>
              <p className="body-text text-white/80 mb-4">
                Your trusted partner for comprehensive interior solutions since 1948.
              </p>
            </div>
            
            <div>
              <h4 className="font-montserrat font-semibold mb-4">Services</h4>
              <ul className="space-y-2 body-text text-white/80">
                <li><a href="#" className="hover:text-white transition-colors">Curtains & Drapes</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blinds & Shades</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Furniture Upholstery</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Wallpapers</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-montserrat font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 body-text text-white/80">
                <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Our Services</a></li>
                <li><a href="#products" className="hover:text-white transition-colors">Products</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-montserrat font-semibold mb-4">Contact Info</h4>
              <div className="space-y-3 body-text text-white/80">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Dubai, UAE</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>+971 4 123 4567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>info@abdulhaqdimensions.com</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/20 mt-8 pt-8 text-center body-text text-white/60">
            <p>&copy; 2024 Abdulhaq Dimensions. All rights reserved. Established 1948.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

