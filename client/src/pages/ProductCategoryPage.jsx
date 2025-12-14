import React from "react";
import { createImageErrorHandler } from '../utils/imageUtils';
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Layout from '../components/Layout';

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-\u0600-\u06FF]/gi, "");
}

export default function ProductCategoryPage() {
  const { t, i18n } = useTranslation("products");
  const { category } = useParams();
  const isAr = i18n.language === "ar";
  const categories = t("categories", { returnObjects: true }) || [];

  // Find the category object by folderPath or slugified title
  const cat = categories.find(
    (c) => c.folderPath === category || slugify(c.title) === category
  );

  if (!cat) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <h2 className="text-2xl text-red-600 mb-4">{isAr ? "لم يتم العثور على المنتج" : "Category not found"}</h2>
        <Link
          to="/products"
          className="px-6 py-2 rounded bg-adh-btn text-adh-btn-fg font-semibold"
        >
          {isAr ? "العودة للمنتجات" : "Back to Products"}
        </Link>
      </div>
    );
  }

  const title = cat.title || 'Products';
  const description = cat.brief || '';
  const image = cat.image || undefined; // per-category OG override (falls back to Layout default)

  const keywords = [
    'Abdulhaq Dimensions', 'products', 'category', cat.title, 'interior solutions', 'Amman', 'Jordan', 'premium', 'design'
  ];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': cat.title,
    'description': cat.brief,
    'image': cat.image,
    'url': `https://abdulhaqdimensions.com/products/${cat.folderPath}`
  };
  return (
    <Layout title={title} description={description} image={image} keywords={keywords} jsonLd={jsonLd}>
      <section className="py-12 px-2 bg-adh-bg min-h-[50vh]">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <img
            src={cat.image}
            alt={cat.title}
            loading="lazy"
            decoding="async"
            className="w-full md:w-96 rounded-lg shadow-md mb-6 md:mb-0 object-cover"
            style={{ maxHeight: 340 }}
            onError={createImageErrorHandler('product')}
          />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-adh-primary dark:text-adh-text mb-2">
              {cat.title}
            </h1>
            <p className="text-adh-text-secondary dark:text-adh-text mb-6">
              {cat.brief}
            </p>
            {cat.sub && cat.sub.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2 dark:text-adh-text">
                  {isAr ? "الأنواع المتوفرة:" : "Available Types:"}
                </h3>
                <ul className="space-y-2">
                  {cat.sub.map((sub, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-adh-primary inline-block" />
                      <span>{sub}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <Link
              to="/products"
              className="inline-block mt-6 px-6 py-2 bg-adh-btn text-adh-btn-fg rounded-lg font-semibold"
            >
              {isAr ? "عودة للمنتجات" : "Back to Products"}
            </Link>
          </div>
        </div>
      </div>
    </section>
    </Layout>
  );
}
