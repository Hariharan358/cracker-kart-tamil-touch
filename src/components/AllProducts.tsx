import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { ProductCard } from "../components/ProductCard";
import { useCart } from "../hooks/useCart";

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

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const res = await axios.get(`https://km-crackers.onrender.com/api/products/category/${encodeURIComponent(category!)}`);
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
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">{category} Products</h2>

      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={{
                id: product._id,
                name_en: product.name_en,
                name_ta: product.name_ta,
                price: product.price,
                original_price: product.original_price,
                image_url: product.imageUrl,
                category: product.category,
                youtube_url: product.youtube_url, // This is correct!
              }}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};
