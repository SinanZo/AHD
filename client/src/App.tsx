import React, { Suspense, lazy } from 'react';
import { Route, Switch } from 'wouter';
import { useTranslation } from 'react-i18next';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import Layout from './components/layouts/Layout';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider } from 'next-themes';

// Lazy load pages for better performance
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ProductCategoryPage = lazy(() => import('./pages/ProductCategoryPage'));
const Clients = lazy(() => import('./pages/Clients'));
const Projects = lazy(() => import('./pages/Projects'));
const Contact = lazy(() => import('./pages/Contact'));
const GalleryPage = lazy(() => import('./components/GalleryPage'));

import './App.css';
import './index.css';

function Router() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language.startsWith('ar');

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className={`min-h-screen bg-lightBg dark:bg-darkBg text-gray-800 dark:text-gray-100 transition-colors duration-300 ${isArabic ? 'rtl-font' : 'ltr-font'}`}
    >
      <Layout>
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="text-lg">Loading sections...</div></div>}>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/about" component={About} />
            <Route path="/services" component={Services} />
            <Route path="/products" component={ProductsPage} />
            <Route path="/products/:category" component={ProductCategoryPage} />
            <Route path="/clients" component={Clients} />
            <Route path="/projects" component={Projects} />
            <Route path="/contact" component={Contact} />
            <Route path="/gallery/:category" component={GalleryPage} />
            <Route path="/404" component={NotFound} />
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </Layout>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
