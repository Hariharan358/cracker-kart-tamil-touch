import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ProductCard } from "../components/ProductCard";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useCart } from "../hooks/useCart";
import { useIsMobile } from "../hooks/use-mobile";
import { ArrowLeft } from "lucide-react";
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
}

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, removeFromCart, cartItems } = useCart();
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
    <div className="min-h-screen bg-background">
      <Navbar cartCount={cartItems.reduce((total, item) => total + item.quantity, 0)} />
      
      <div className="w-full px-3 sm:px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <Button variant="ghost" asChild className="mb-3 sm:mb-4">
            <Link to="/categories">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="text-xs sm:text-sm">Back to Categories</span>
            </Link>
          </Button>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">{category} Products</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">{products.length} products found</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12 sm:py-16">
            <p className="text-xs sm:text-sm">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <p className="text-xs sm:text-sm text-muted-foreground">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
            {products.map((product) => {
              const cartItem = cartItems.find(item => item.id === product._id);
              const quantity = cartItem ? cartItem.quantity : 0;
              
              return (
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
                  onRemoveFromCart={removeFromCart}
                  quantity={quantity}
                  size={isMobile ? "sm" : "md"}
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
