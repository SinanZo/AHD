// components/ProductCard.jsx
import React from 'react';
export default function ProductCard({ category, subcategories = [] }) {
  // Category objects contain localized fields; choose by presence
  const isAr = typeof category === 'object' && !!category.ar;

  return (
    <div className="rounded-xl p-6 mb-6 transition-all bg-white dark:bg-[#121a24] text-gray-900 dark:text-gray-100 border border-black/10 dark:border-white/10 shadow-[0_10px_30px_-15px_rgba(0,0,0,.25)] hover:shadow-[0_18px_40px_-12px_rgba(0,0,0,.45)]">
      <h2 className={`text-xl font-bold mb-2 ${isAr ? 'text-right' : ''}`}>
        {isAr ? category.ar : category.category}
      </h2>
      {subcategories.length > 0 && (
        <ul className={`list-disc ${isAr ? 'mr-6 text-right' : 'ml-6'} marker:text-primary/70 dark:marker:text-accent/70`}>
          {subcategories.map((sub, idx) => (
            <li key={idx}>{isAr ? sub.ar : sub.en}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
