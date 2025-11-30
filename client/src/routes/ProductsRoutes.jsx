import React from "react";
import { Routes, Route } from "react-router-dom";
import Products from "../pages/Products";
import GalleryPage from "../components/GalleryPage";

export default function ProductsRoutes() {
  return (
    <Routes>
      <Route path="/products" element={<Products />} />
<Route path="/products/:category" element={<GalleryPage />} />
    </Routes>
  );
}
