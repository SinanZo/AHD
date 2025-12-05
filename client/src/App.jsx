import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'wouter';
import { useTranslation } from 'react-i18next';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

const Home = lazy(() => import('./pages/Home.jsx'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ProductCategoryPage = lazy(() => import('./pages/ProductCategoryPage'));
const Clients = lazy(() => import('./pages/Clients'));
const Projects = lazy(() => import('./pages/Projects'));
const Contact = lazy(() => import('./pages/Contact'));
const GalleryPage = lazy(() => import('./components/GalleryPage'));

export default function App() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language.startsWith('ar');

  return (
    <ErrorBoundary>
      <div
        dir={isArabic ? 'rtl' : 'ltr'}
        className={`theme-animated min-h-screen bg-adh-bg text-adh-text ${isArabic ? 'rtl-font' : 'ltr-font'}`}
      >
        <Suspense fallback={null}>
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
          </Switch>
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}
