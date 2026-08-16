import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Tag, Layers, ShieldCheck, Truck, Headphones, Award, Package, ShoppingCart } from "lucide-react";
import HeroSlider from "../components/HeroSlider";
import { brandAPI, categoryAPI, productAPI } from "../services/api";
import { useCart } from "../services/cartContext";

export default function StoreHome() {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState(null);

  const { addItem } = useCart();

  useEffect(() => {
    (async () => {
      try {
        const [brandsRes, categoriesRes, productsRes] = await Promise.all([
          brandAPI.getAll(),
          categoryAPI.getAll(),
          productAPI.getAll(),
        ]);
        setBrands(brandsRes.data || []);
        setCategories(categoriesRes.data || []);
        setProducts((productsRes.data || []).filter((p) => p.active !== false));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleAddToCart = (product) => {
    addItem(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1200);
  };

  const featuredProducts = products.slice(0, 8);

  return (
    <div>
      <HeroSlider />

      {/* Compatible OEM Vehicle Brands — sliding strip */}
      {!loading && brands.length > 0 && (
        <section className="bg-white py-10 border-b border-gray-100">
          <p className="text-center text-primary text-xs sm:text-sm font-bold tracking-widest uppercase mb-8">
            Compatible OEM Vehicle Brands
          </p>

          <div className="brand-marquee">
            <div className="brand-marquee-track">
              {[...brands, ...brands].map((brand, i) => (
                <div
                  key={`${brand.id}-${i}`}
                  className="flex items-center justify-center shrink-0 w-40 sm:w-48 px-6"
                >
                  {brand.logoUrl ? (
                    <img
                      src={brand.logoUrl}
                      alt={brand.name}
                      className="max-h-12 sm:max-h-14 w-auto object-contain grayscale hover:grayscale-0 transition-all"
                    />
                  ) : (
                    <span className="text-gray-400 font-semibold text-sm">{brand.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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
                className="bg-white border rounded-xl overflow-hidden flex flex-col items-center hover:shadow-md hover:border-secondary transition-all"
              >
                <div className="w-full aspect-square bg-accent flex items-center justify-center overflow-hidden">
                  {brand.logoUrl ? (
                    <img src={brand.logoUrl} alt={brand.name} className="w-full h-full object-contain p-3" />
                  ) : (
                    <Tag size={28} className="text-primary" />
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700 text-center py-3 px-2">{brand.name}</span>
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

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between mb-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Package className="text-secondary" size={22} />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Our Products</h2>
            </div>
            <p className="text-gray-500">A look at what's in stock right now.</p>
          </div>
          <Link
            to="/store/catalogue"
            className="hidden sm:block text-sm font-medium text-secondary hover:text-orange-600 shrink-0"
          >
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse"
              >
                <div className="w-full aspect-square bg-gray-100" />
                <div className="p-3 space-y-2">
                  <div className="h-3.5 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="text-center text-gray-400 py-8 mt-6">No products available yet.</div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
              {featuredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-secondary/40 transition-all"
                >
                  <div className="w-full aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-gray-300">
                        <Package size={28} />
                        <span className="text-xs mt-1">No image</span>
                      </div>
                    )}
                  </div>

                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                    <div className="flex items-center justify-between mt-0.5 mb-2">
                      <p className="text-xs text-gray-400">{product.brand || product.category}</p>
                      <p className="text-xs font-semibold text-gray-700">
                        ₹{Number(product.price).toFixed(2)}
                      </p>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      className={`w-full flex items-center justify-center gap-1.5 text-sm font-medium py-2 rounded-lg transition-colors ${
                        product.stock === 0
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : addedId === product.id
                            ? "bg-green-600 text-white"
                            : "bg-secondary text-white hover:bg-orange-600"
                      }`}
                    >
                      {product.stock === 0 ? (
                        "Out of Stock"
                      ) : addedId === product.id ? (
                        "Added ✓"
                      ) : (
                        <>
                          <ShoppingCart size={14} /> Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8 sm:hidden">
              <Link
                to="/store/catalogue"
                className="inline-block text-sm font-medium text-secondary hover:text-orange-600"
              >
                View All →
              </Link>
            </div>
          </>
        )}
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
