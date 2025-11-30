// src/components/layouts/Layout.jsx
import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import Header from './Header';
import Footer from './Footer';
import ScrollProgress from '../ui/ScrollProgress';
import FloatingActions from '../ui/FloatingActions';

export default function Layout({ children }) {
  const location = useLocation();

  // Optional: scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <>
      <Header />
      <ScrollProgress />
      <main
        id="main-content"
        role="main"
        className="min-h-screen bg-white dark:bg-[#18191e] transition-colors duration-200"
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
