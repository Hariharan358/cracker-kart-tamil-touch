import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { ProductCard } from "../components/ProductCard";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { useCart } from "../hooks/useCart";
import { useLanguage } from "../contexts/LanguageContext";
import { getProductsByCategory, Product as BackendProduct } from "../data/api"; // 👈 backend product type
import { useToast } from "../hooks/use-toast";

// 👇 Define frontend product type matching ProductCardProps
type FrontendProduct = {
  id: string;
  name_en: string;
  name_ta: string;
  price: number;
  original_price?: number;
  image_url: string;
  category: string;
  youtube_url?: string; // <-- Add this line
};

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const { getTotalItems, addToCart, cartItems, updateQuantity } = useCart();
  const { toast } = useToast();
  const { t } = useLanguage();

  const decodedCategory = decodeURIComponent(category || "");

  const [products, setProducts] = useState<FrontendProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data: BackendProduct[] = await getProductsByCategory(decodedCategory);

        // 🔁 Convert backend product (_id, imageUrl) to frontend type
        const transformed: FrontendProduct[] = data.map((product) => ({
          id: product._id,
          name_en: product.name_en,
          name_ta: product.name_ta,
          price: product.price,
          original_price: product.original_price,
          image_url: product.imageUrl,
          category: product.category,
          youtube_url: product.youtube_url, // <-- Add this line
        }));

        setProducts(transformed);
      } catch (error) {
        console.error("❌ Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [decodedCategory]);

  const handleAddToCart = (product: FrontendProduct) => {
    addToCart(product);
    toast({
      title: "Added to cart!",
      description: `${product.name_en} has been added to your cart.`,
      duration: 2000,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-xl text-muted-foreground">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={getTotalItems()} />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/categories">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Categories
            </Link>
          </Button>
        </div>

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="title-styled text-primary">
              {decodedCategory}
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            {products.length} products available
          </p>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => {
              const quantity = cartItems.find(item => item.id === product.id)?.quantity || 0;
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onRemoveFromCart={() => updateQuantity(product.id, quantity - 1)}
                  quantity={quantity}
                  size="sm"
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground mb-4">
              No products available in this category yet.
            </p>
            <Button variant="outline" asChild>
              <Link to="/categories">
                Browse Other Categories
              </Link>
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CategoryPage;
