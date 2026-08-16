import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, ShoppingCart, Package, X } from "lucide-react";
import { productAPI, brandAPI, categoryAPI } from "../services/api";
import { useCart } from "../services/cartContext";

export default function StoreCatalogue() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [addedId, setAddedId] = useState(null);

  const activeBrand = searchParams.get("brand") || "";
  const activeCategory = searchParams.get("category") || "";

  const { addItem } = useCart();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [productsRes, brandsRes, categoriesRes] = await Promise.all([
          productAPI.getAll(),
          brandAPI.getAll(),
          categoryAPI.getAll(),
        ]);
        setProducts((productsRes.data || []).filter((p) => p.active !== false));
        setBrands(brandsRes.data || []);
        setCategories(categoriesRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const setFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesBrand = !activeBrand || p.brand === activeBrand;
      const matchesCategory = !activeCategory || p.category === activeCategory;
      const matchesSearch =
        !search ||
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase());
      return matchesBrand && matchesCategory && matchesSearch;
    });
  }, [products, activeBrand, activeCategory, search]);

  const handleAddToCart = (product) => {
    addItem(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1200);
  };

  const SkeletonCard = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      <div className="w-full aspect-square bg-gray-100" />
      <div className="p-3 space-y-2">
        <div className="h-3.5 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Catalogue</h1>
        <p className="text-gray-500 text-sm sm:text-base">
          Browse our full range and add items to your cart
        </p>
      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by name or description..."
            className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
          />
        </div>
      </div>

      {/* FILTERS */}
      <div className="space-y-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Brands
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("brand", "")}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                !activeBrand
                  ? "bg-primary text-white border-primary"
                  : "text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              All Brands
            </button>
            {brands.map((b) => (
              <button
                key={b.id}
                onClick={() => setFilter("brand", b.name)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                  activeBrand === b.name
                    ? "bg-primary text-white border-primary"
                    : "text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {b.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Categories
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("category", "")}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                !activeCategory
                  ? "bg-secondary text-white border-secondary"
                  : "text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              All Categories
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setFilter("category", c.name)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                  activeCategory === c.name
                    ? "bg-secondary text-white border-secondary"
                    : "text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {(activeBrand || activeCategory) && (
          <button
            onClick={() => setSearchParams({})}
            className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700"
          >
            <X size={14} /> Clear filters
          </button>
        )}
      </div>

      {/* PRODUCTS */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          {search.trim()
            ? `Search results for "${search}"`
            : activeBrand || activeCategory || "All Products"}
        </h2>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-gray-500 bg-white rounded-xl border border-gray-100">
            No products found
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
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
        )}
      </div>
    </div>
  );
}
