import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Tag, Layers, ShieldCheck, Truck, Headphones, Award } from "lucide-react";
import HeroSlider from "../components/HeroSlider";
import { brandAPI, categoryAPI } from "../services/api";

export default function StoreHome() {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [brandsRes, categoriesRes] = await Promise.all([
          brandAPI.getAll(),
          categoryAPI.getAll(),
        ]);
        setBrands(brandsRes.data || []);
        setCategories(categoriesRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      <HeroSlider />

      {/* Shop by Brand */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-center gap-2 mb-2">
          <Tag className="text-secondary" size={22} />
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Shop by Brand</h2>
        </div>
        <p className="text-gray-500 mb-8">Explore products from the brands you trust.</p>

        {loading ? (
          <div className="text-center text-gray-400 py-8">Loading brands...</div>
        ) : brands.length === 0 ? (
          <div className="text-center text-gray-400 py-8">No brands available yet.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                to={`/store/catalogue?brand=${encodeURIComponent(brand.name)}`}
                className="bg-white border rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:shadow-md hover:border-secondary transition-all"
              >
                <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center overflow-hidden">
                  {brand.logoUrl ? (
                    <img src={brand.logoUrl} alt={brand.name} className="w-full h-full object-cover" />
                  ) : (
                    <Tag size={22} className="text-primary" />
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700 text-center">{brand.name}</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Shop by Category */}
      <section className="bg-accent py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="text-secondary" size={22} />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Shop by Category</h2>
          </div>
          <p className="text-gray-500 mb-8">Find exactly what you need, organized by type.</p>

          {loading ? (
            <div className="text-center text-gray-400 py-8">Loading categories...</div>
          ) : categories.length === 0 ? (
            <div className="text-center text-gray-400 py-8">No categories available yet.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/store/catalogue?category=${encodeURIComponent(cat.name)}`}
                  className="bg-white rounded-xl p-6 text-center hover:shadow-md transition-all border hover:border-secondary"
                >
                  <Layers className="mx-auto text-primary mb-2" size={24} />
                  <span className="font-medium text-gray-700">{cat.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Company info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">About Jainam</h2>
            <p className="text-gray-600 mb-4">
              Jainam has been a dependable supplier of pipes, valves, fittings and related
              hardware for businesses across the region. We work directly with leading brands
              to keep our catalogue current, competitively priced, and always in stock.
            </p>
            <p className="text-gray-600">
              Every client is paired with a dedicated account manager who handles orders,
              pricing, and invoicing personally — so you always know who to call.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border rounded-xl p-5 text-center">
              <ShieldCheck className="mx-auto text-primary mb-2" size={26} />
              <p className="font-semibold text-gray-800">Trusted Quality</p>
            </div>
            <div className="bg-white border rounded-xl p-5 text-center">
              <Truck className="mx-auto text-primary mb-2" size={26} />
              <p className="font-semibold text-gray-800">Reliable Supply</p>
            </div>
            <div className="bg-white border rounded-xl p-5 text-center">
              <Headphones className="mx-auto text-primary mb-2" size={26} />
              <p className="font-semibold text-gray-800">Dedicated Support</p>
            </div>
            <div className="bg-white border rounded-xl p-5 text-center">
              <Award className="mx-auto text-primary mb-2" size={26} />
              <p className="font-semibold text-gray-800">Trusted Brands</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
