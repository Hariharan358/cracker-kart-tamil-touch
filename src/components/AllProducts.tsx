import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { ProductCard } from "../components/ProductCard";
import { useCart } from "../hooks/useCart";
import { useIsMobile } from "../hooks/use-mobile";
import { Loader2 } from "lucide-react";

interface Product {
  _id: string;
  name_en: string;
  name_ta: string;
  price: number;
  original_price?: number;
  imageUrl: string;
  category: string;
  youtube_url?: string; // Added youtube_url to the interface
   // Added original_price to the interface
  createdAt?: string;
}

interface Category {
  name: string;
  displayName?: string;
  displayName_en?: string;
  displayName_ta?: string;
}

export const CategoryProducts = () => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryInfo, setCategoryInfo] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingCategory, setLoadingCategory] = useState(true);
  const { addToCart } = useCart();
  const isMobile = useIsMobile();

  // Fetch category information
  useEffect(() => {
    const fetchCategoryInfo = async () => {
      try {
        setLoadingCategory(true);
        const res = await axios.get('https://cracker-backend-rvta.onrender.com/api/categories/public');
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

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`https://cracker-backend-rvta.onrender.com/api/products/category/${encodeURIComponent(category!)}?t=${Date.now()}`);
        setProducts(res.data);
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

  // Get the display name to show
  const getDisplayName = () => {
    if (!categoryInfo) return category;
    return categoryInfo.displayName || categoryInfo.displayName_en || categoryInfo.name;
  };

  // Get the Tamil display name
  const getTamilDisplayName = () => {
    if (!categoryInfo) return "";
    return categoryInfo.displayName_ta || "";
  };

  return (
    <div className="w-full px-3 sm:px-4 py-4 sm:py-6">
      {loadingCategory ? (
        <div className="flex items-center mb-4">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          <span className="text-sm">Loading category...</span>
        </div>
      ) : (
        <div className="mb-3 sm:mb-4">
          <h2 className="text-xl sm:text-2xl font-bold">{getDisplayName()} Products</h2>
          {getTamilDisplayName() && (
            <h3 className="text-sm sm:text-base text-muted-foreground">{getTamilDisplayName()}</h3>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-6 sm:py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span className="text-sm">Loading products...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="flex justify-center items-center py-6 sm:py-8">
          <p className="text-xs sm:text-sm">No products found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={{
                id: product._id,
                name_en: product.name_en,
                name_ta: product.name_ta,
                price: product.price,
                original_price: product.original_price,
                imageUrl: product.imageUrl,
                category: product.category,
                youtube_url: product.youtube_url,
                createdAt: product.createdAt,
              }}
              onAddToCart={addToCart}
              size={isMobile ? "sm" : "md"}
              categoryDisplayName={getDisplayName()}
            />
          ))}
        </div>
      )}
    </div>
  );
};
