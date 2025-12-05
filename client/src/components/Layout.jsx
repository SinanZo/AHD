import React from 'react';
import { Helmet } from 'react-helmet-async';
import SeoPerRoute from './SeoPerRoute';
import Header from './layouts/Header';
import Footer from './layouts/Footer';
import ScrollProgress from './ui/ScrollProgress';
import FloatingActions from './ui/FloatingActions';

const DEFAULT_OG_IMAGE = '/images/hero-bg.jpg';

export default function Layout({ title, description, image, jsonLd, keywords, children }) {
  const ogImage = image || DEFAULT_OG_IMAGE;
  return (
    <>
      <SeoPerRoute title={title} description={description} image={ogImage} jsonLd={jsonLd} keywords={keywords} />
      <Header />
      <ScrollProgress />
      <main
        id="main-content"
        role="main"
        className="min-h-screen bg-adh-bg text-adh-text transition-colors duration-200"
        tabIndex={-1}
        aria-label="Main Content"
      >
        {children}
      </main>
      <FloatingActions />
      <Footer />
    </>
  );
}
