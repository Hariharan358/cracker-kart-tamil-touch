import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { ProductCard } from "../components/ProductCard";
import { Button } from "../components/ui/button";
import { useCart } from "../hooks/useCart";
import { getProductsByCategory } from "../data/mockData";
import { useToast } from "../hooks/use-toast";

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const { getTotalItems, addToCart } = useCart();
  const { toast } = useToast();
  
  const decodedCategory = decodeURIComponent(category || "");
  const products = getProductsByCategory(decodedCategory);

  const handleAddToCart = (product: any) => {
    addToCart(product);
    toast({
      title: "Added to cart!",
      description: `${product.name_en} has been added to your cart.`,
      duration: 2000,
    });
  };

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
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              {decodedCategory}
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            {products.length} products available
          </p>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
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
    </div>
  );
};

export default CategoryPage;