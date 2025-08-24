import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { ProductCard } from "../components/ProductCard";
import { useCart } from "../hooks/useCart";
import { useIsMobile } from "../hooks/use-mobile";

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
}

export const CategoryProducts = () => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const res = await axios.get(`https://api.kmpyrotech.com/api/products/category/${encodeURIComponent(category!)}`);
        setProducts(res.data);
      } catch (err) {
        console.error("❌ Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [category]);

  return (
    <div className="w-full px-3 sm:px-4 py-4 sm:py-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">{category} Products</h2>

      {loading ? (
        <div className="flex justify-center items-center py-6 sm:py-8">
          <p className="text-xs sm:text-sm">Loading...</p>
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
              }}
              onAddToCart={addToCart}
              size={isMobile ? "sm" : "md"}
            />
          ))}
        </div>
      )}
    </div>
  );
};
