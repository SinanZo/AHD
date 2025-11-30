import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from './layouts/Header';

export default function Layout({ title, description, children }) {
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>
      <Header />
      <main>
        {children}
      </main>
    </>
  );
}
