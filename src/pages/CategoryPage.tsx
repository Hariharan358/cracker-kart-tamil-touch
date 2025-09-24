import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { ProductCard } from "../components/ProductCard";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useCart } from "../hooks/useCart";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

interface Product {
  _id: string;
  name_en: string;
  name_ta: string;
  price: number;
  original_price?: number;
  imageUrl: string;
  category: string;
  youtube_url?: string;
  createdAt?: string;
}

interface Category {
  name: string;
  displayName?: string;
  displayName_en?: string;
  displayName_ta?: string;
}

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryInfo, setCategoryInfo] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingCategory, setLoadingCategory] = useState(true);
  const { addToCart, removeFromCart, cartItems } = useCart();

  // Fetch category information
  useEffect(() => {
    const fetchCategoryInfo = async () => {
      try {
        setLoadingCategory(true);
        const res = await axios.get('https://api.kmpyrotech.com/api/categories/public');
        const categories = res.data;
        
        // Find the category by name
        const foundCategory = categories.find((cat: Category) => cat.name === category);
        if (foundCategory) {
          setCategoryInfo(foundCategory);
        } else {
          // If not found, create a fallback category info
          setCategoryInfo({
            name: category!,
            displayName: category!,
            displayName_en: category!,
            displayName_ta: ""
          });
        }
      } catch (err) {
        console.error("❌ Error fetching category info:", err);
        // Fallback to using the category name from URL
        setCategoryInfo({
          name: category!,
          displayName: category!,
          displayName_en: category!,
          displayName_ta: ""
        });
      } finally {
        setLoadingCategory(false);
      }
    };

    if (category) {
      fetchCategoryInfo();
    }
  }, [category]);

  // Fetch products for the category
  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        const timestamp = Date.now();
        const tryFetch = async (key: string) => {
          const r = await axios.get(`https://api.kmpyrotech.com/api/products/category/${encodeURIComponent(key)}?t=${timestamp}`);
          return Array.isArray(r.data) ? r.data : [];
        };

        let list: any[] = await tryFetch(category!);

        if ((!list || list.length === 0) && categoryInfo) {
          const candidates = new Set<string>();
          if (categoryInfo.name) candidates.add(categoryInfo.name);
          if (categoryInfo.displayName) candidates.add(categoryInfo.displayName);
          if (categoryInfo.displayName_en) candidates.add(categoryInfo.displayName_en);
          for (const c of candidates) {
            if (!c) continue;
            const alt = await tryFetch(c);
            if (alt.length > 0) { list = alt; break; }
          }
        }

        if ((!list || list.length === 0)) {
          try {
            const catRes = await axios.get('https://api.kmpyrotech.com/api/categories/public');
            const cats: any[] = Array.isArray(catRes.data) ? catRes.data : [];
            const targetDisplay = (categoryInfo?.displayName_en || categoryInfo?.displayName || category) || '';
            const normalized = (s: string) => String(s || '').trim().toUpperCase().replace(/[^A-Z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
            const targetNorm = normalized(targetDisplay);
            let match = cats.find(c => normalized(c.displayName_en || c.displayName || c.name) === targetNorm);
            if (!match) match = cats.find(c => normalized(c.displayName_en || c.displayName || c.name).includes(targetNorm));
            if (match?.name) {
              const alt = await tryFetch(match.name);
              if (alt.length > 0) list = alt;
            }
          } catch {}
        }

        // 4) Last-resort: fetch all products and fuzzy-filter by category name similarity
        if ((!list || list.length === 0)) {
          try {
            const allRes = await axios.get(`https://api.kmpyrotech.com/api/products?t=${timestamp}`);
            const all: any[] = Array.isArray(allRes.data) ? allRes.data : [];
            const norm = (s: string) => String(s || '').trim().toUpperCase().replace(/[^A-Z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
            const target = norm(categoryInfo?.displayName_en || categoryInfo?.displayName || category || '');
            const filtered = all.filter(p => {
              const c = norm(p.category);
              return c === target || c.includes(target) || target.includes(c);
            });
            if (filtered.length > 0) list = filtered;
          } catch {}
        }

        setProducts(list || []);
      } catch (err) {
        console.error("❌ Error fetching products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchCategoryProducts();
    }
  }, [category]);

  // Get the display name to show (with Family->Combo override for UI only)
  const getDisplayName = () => {
    if (!categoryInfo) return category;
    const base = categoryInfo.displayName || categoryInfo.displayName_en || categoryInfo.name;
    return (base || '').toUpperCase() === 'FAMILY PACK' ? 'COMBO PACK' : base;
  };

  // Get the Tamil display name (with Family->Combo override for UI only)
  const getTamilDisplayName = () => {
    if (!categoryInfo) return "";
    const baseTa = categoryInfo.displayName_ta || "";
    // Replace common Tamil phrase for Family Pack to Combo Pack
    return baseTa.includes('குடும்ப') ? baseTa.replace('குடும்ப', 'காம்போ') : baseTa;
  };

  // Transform product titles locally for this page only when category is FAMILY PACK
  const transformTitleEn = (name: string) => {
    return name?.replace(/\bFamily Pack\b/gi, 'Combo Pack');
  };

  const transformTitleTa = (name: string) => {
    // Replace the word corresponding to Family with Combo while keeping rest
    return name?.replace('குடும்ப', 'காம்போ');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={cartItems.reduce((total, item) => total + item.quantity, 0)} />
      
      <div className="w-full px-4 py-8">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/categories">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Categories
            </Link>
          </Button>
          
          {loadingCategory ? (
            <div className="flex items-center mb-4">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Loading category...</span>
            </div>
          ) : (
            <div>
              <h1 className="text-3xl font-bold mb-2">{getDisplayName()} Products</h1>
              {getTamilDisplayName() && (
                <h2 className="text-xl text-muted-foreground mb-2">{getTamilDisplayName()}</h2>
              )}
              <p className="text-muted-foreground">{products.length} products found</p>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span>Loading products...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {products.map((product) => {
              const cartItem = cartItems.find(item => item.id === product._id);
              const quantity = cartItem ? cartItem.quantity : 0;
              
              return (
                <ProductCard
                  key={product._id}
                  product={{
                    id: product._id,
                    name_en: transformTitleEn(product.name_en),
                    name_ta: transformTitleTa(product.name_ta),
                    price: product.price,
                    original_price: product.original_price,
                    imageUrl: product.imageUrl,
                    category: product.category,
                    youtube_url: product.youtube_url,
                    createdAt: product.createdAt,
                  }}
                  onAddToCart={addToCart}
                  onRemoveFromCart={removeFromCart}
                  quantity={quantity}
                  categoryDisplayName={getDisplayName()}
                />
              );
            })}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default CategoryPage;
