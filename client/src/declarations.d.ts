declare module '../components/Layout' {
  import React from 'react';
  export interface LayoutProps {
    title?: string;
    description?: string;
    children?: React.ReactNode;
  }
  const Layout: React.FC<LayoutProps>;
  export default Layout;
}

declare module '../components/Layout.jsx' {
  import React from 'react';
  export interface LayoutProps {
    title?: string;
    description?: string;
    children?: React.ReactNode;
  }
  const Layout: React.FC<LayoutProps>;
  export default Layout;
}
