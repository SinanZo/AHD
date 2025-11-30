import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Layout from './components/layouts/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ProductsPage from './pages/ProductsPage';  // Using the updated ProductsPage
import Clients from './pages/Clients';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import GalleryPage from './components/GalleryPage';

import './App.css';

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

