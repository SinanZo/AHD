import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Layout from './components/layouts/Layout';
import Home from './pages/Home';
import ProductsPage from './pages/ProductsPage';
import GalleryPage from './components/GalleryPage';

import './App.css';

// Simple placeholder components for missing pages
const About = () => <div className="p-8"><h1>About Page</h1><p>About content coming soon...</p></div>;
const Services = () => <div className="p-8"><h1>Services Page</h1><p>Services content coming soon...</p></div>;
const Clients = () => <div className="p-8"><h1>Clients Page</h1><p>Clients content coming soon...</p></div>;
const Projects = () => <div className="p-8"><h1>Projects Page</h1><p>Projects content coming soon...</p></div>;
const Contact = () => <div className="p-8"><h1>Contact Page</h1><p>Contact content coming soon...</p></div>;

export default function App() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language.startsWith('ar');

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'} className={isArabic ? 'rtl-font' : 'ltr-font'}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:category" element={<GalleryPage />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

