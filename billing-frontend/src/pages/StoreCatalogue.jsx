import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, ShoppingCart, Plus, Package, X } from "lucide-react";
import { productAPI, brandAPI, categoryAPI } from "../../services/api";
import { useCart } from "../../services/cartContext";

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Catalogue</h1>
        <p className="text-gray-500">Browse our full range and add items to your cart.</p>
      </div>

      {/* Search + filters */}
      <div className="bg-white border rounded-xl p-4 mb-8 space-y-4">
        <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
          <Search size={18} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 outline-none text-sm min-w-0"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("brand", "")}
            className={`px-3 py-1.5 rounded-full text-sm border ${
              !activeBrand ? "bg-primary text-white border-primary" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            All Brands
          </button>
          {brands.map((b) => (
            <button
              key={b.id}
              onClick={() => setFilter("brand", b.name)}
              className={`px-3 py-1.5 rounded-full text-sm border ${
                activeBrand === b.name
                  ? "bg-primary text-white border-primary"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("category", "")}
            className={`px-3 py-1.5 rounded-full text-sm border ${
              !activeCategory ? "bg-secondary text-white border-secondary" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            All Categories
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilter("category", c.name)}
              className={`px-3 py-1.5 rounded-full text-sm border ${
                activeCategory === c.name
                  ? "bg-secondary text-white border-secondary"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {c.name}
            </button>
          ))}
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

      {/* Product grid */}
      {loading ? (
        <div className="text-center text-gray-400 py-16">Loading products...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center text-gray-400 py-16">
          <Package size={40} className="mx-auto mb-3" />
          No products match your filters.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white border rounded-xl overflow-hidden flex flex-col hover:shadow-md transition-shadow"
            >
              <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <Package size={32} className="text-gray-300" />
                )}
              </div>
              <div className="p-3 flex-1 flex flex-col">
                <p className="text-xs text-gray-400 mb-0.5">{product.brand || product.category}</p>
                <p className="font-medium text-gray-800 text-sm mb-1 line-clamp-2">{product.name}</p>
                <p className="text-primary font-bold mt-auto">₹{Number(product.price).toFixed(2)}</p>
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                  className={`mt-2 w-full flex items-center justify-center gap-1.5 text-sm font-medium py-2 rounded-lg transition-colors ${
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
  );
}
