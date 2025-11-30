import React from 'react';
import Layout from '../components/Layout';

export default function Home() {
  const title = 'Home | Abdulhaq Dimensions';
  const description = 'Premium interior & shading solutions in Amman, Jordan.';

  return (
    <Layout title={title} description={description}>
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Abdulhaq Dimensions</h1>
        <h2>Testing with Layout...</h2>
      </div>
    </Layout>
  );
}
