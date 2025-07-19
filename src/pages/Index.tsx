import { Link } from "react-router-dom";
import { Sparkles, Zap, Gift } from "lucide-react";
import { Button } from "../components/ui/button";
import { CategoryCard } from "../components/CategoryCard";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useEffect, useState } from "react";
import { ProductCard } from "../components/ProductCard";
import { useCart } from "../hooks/useCart";
import { useLanguage } from "../contexts/LanguageContext";
import { getCategoriesWithCount } from "../data/mockData";
import heroImage from "../assets/hero-fireworks.jpg";
import { useLocation } from "react-router-dom";

const Index = () => {
  const { getTotalItems, addToCart } = useCart();
  const { t } = useLanguage();
  const categories = getCategoriesWithCount();
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [sparklerProducts, setSparklerProducts] = useState([]);
  const [loadingSparklers, setLoadingSparklers] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Fetch products from a default category or all categories
    const fetchProducts = async () => {
      try {
        // Example: fetch from 'ATOM BOMB' category, or change as needed
        const res = await fetch("http://localhost:5000/api/products/category/ATOM%20BOMB");
        const data = await res.json();
        setProducts(data.slice(0, 4)); // Show only 4 featured products
      } catch (err) {
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, [location]);

  useEffect(() => {
    const fetchSparklers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products/category/SPARKLER%20ITEMS");
        const data = await res.json();
        console.log('Sparkler products:', data); // <-- Add this
        console.log('Sparkler products:', data.slice(0, 4));

        setSparklerProducts(data.slice(0, 4));
      } catch (err) {
        setSparklerProducts([]);
      } finally {
        setLoadingSparklers(false);
      }
    };
    fetchSparklers();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={getTotalItems()} />
      
      {/* Hero Section */}
      <div className="relative min-h-[60vh] flex flex-col justify-center items-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center scale-105 animate-float"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        {/* Colorful animated gradient overlays for both themes */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {/* Light theme subtle pastel gradient */}
          <div className="w-full h-full bg-gradient-to-br from-yellow-100 via-pink-100 to-blue-100 opacity-40 animate-none dark:opacity-0" style={{mixBlendMode: 'screen'}} />
          {/* Dark theme vibrant gradient */}
          <div className="w-full h-full hidden dark:block bg-gradient-to-br from-fuchsia-700 via-blue-900 to-yellow-700 opacity-70 animate-gradient-x" style={{mixBlendMode: 'screen', position: 'absolute', top: 0, left: 0}} />
        </div>
        <div className="absolute inset-0 bg-gradient-hero dark:bg-gradient-hero z-20" />
        {/* Animated sparkles overlay */}
        <div className="absolute inset-0 pointer-events-none flex justify-center items-center z-30">
          <Sparkles className="h-24 w-24 text-primary/30 animate-sparkle" />
        </div>
        <div className="relative z-40 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-center mx-auto">
            <div className="flex items-center justify-center mb-4 space-x-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Sparkles className="h-8 w-8 text-primary animate-sparkle" />
              <Zap className="h-10 w-10 text-accent animate-bounce-gentle" />
              <Sparkles className="h-8 w-8 text-primary animate-sparkle" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <span className="bg-gradient-primary bg-clip-text text-white dark:bg-gradient-primary dark:bg-clip-text">
                {t('heroTitle')}
              </span>
            </h1>
            <p className="text-xl text-foreground/90 mb-8 leading-relaxed animate-fade-in" style={{ animationDelay: '0.5s' }}>
              {t('heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.7s' }}>
              <Button variant="festive" size="lg" asChild className="transition-transform duration-300 hover:scale-110">
                <Link to="/categories">
                  <Gift className="mr-2 h-5 w-5" />
                  {t('shopNow')}
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="transition-transform duration-300 hover:scale-105">
                <Link to="/track">
                  {t('trackYourOrder')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-4 sm:p-6 bg-gradient-card dark:bg-gradient-card rounded-lg shadow-card hover:shadow-glow transition-all duration-300 animate-slide-up dark:shadow-[0_0_24px_0_hsl(45,100%,60%,0.5)]" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-center mb-3 sm:mb-4">
                <span className="inline-flex items-center justify-center h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-yellow-100 dark:bg-yellow-900/40 shadow-[0_0_16px_0_hsl(45,100%,60%,0.3)]">
                  <Sparkles className="h-8 w-8 sm:h-12 sm:w-12 text-yellow-500 dark:text-yellow-300 animate-glow" />
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 text-foreground dark:text-yellow-100">{t('featureQuality')}</h3>
              <p className="text-sm sm:text-base text-muted-foreground dark:text-yellow-200/80">{t('featureQualityDesc')}</p>
            </div>
            <div className="text-center p-4 sm:p-6 bg-gradient-card dark:bg-gradient-card rounded-lg shadow-card hover:shadow-glow transition-all duration-300 animate-slide-up dark:shadow-[0_0_24px_0_hsl(210,100%,60%,0.4)]" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center justify-center mb-3 sm:mb-4">
                <span className="inline-flex items-center justify-center h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-blue-100 dark:bg-blue-900/40 shadow-[0_0_16px_0_hsl(210,100%,60%,0.3)]">
                  <Zap className="h-8 w-8 sm:h-12 sm:w-12 text-blue-500 dark:text-blue-300 animate-bounce-gentle" />
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 text-foreground dark:text-blue-100">{t('featureDelivery')}</h3>
              <p className="text-sm sm:text-base text-muted-foreground dark:text-blue-200/80">{t('featureDeliveryDesc')}</p>
            </div>
            <div className="text-center p-4 sm:p-6 bg-gradient-card dark:bg-gradient-card rounded-lg shadow-card hover:shadow-glow transition-all duration-300 animate-slide-up dark:shadow-[0_0_24px_0_hsl(0,100%,60%,0.4)]" style={{ animationDelay: '0.6s' }}>
              <div className="flex items-center justify-center mb-3 sm:mb-4">
                <span className="inline-flex items-center justify-center h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-red-100 dark:bg-red-900/40 shadow-[0_0_16px_0_hsl(0,100%,60%,0.3)]">
                  <Gift className="h-8 w-8 sm:h-12 sm:w-12 text-red-500 dark:text-red-300 animate-glow" />
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 text-foreground dark:text-red-100">{t('featureOffers')}</h3>
              <p className="text-sm sm:text-base text-muted-foreground dark:text-red-200/80">{t('featureOffersDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('allCategories')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('exploreCategories')}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-6 lg:grid-cols-4 xl:grid-cols-4">
            {categories.slice(0, 8).map((category, idx) => (
              <div key={category.name} className="animate-fade-in" style={{ animationDelay: `${0.1 + idx * 0.07}s` }}>
                <CategoryCard
                  category={category.name}
                  productCount={category.count}
                />
              </div>
            ))}
          </div>
          <div className="text-center mt-12 animate-fade-in" style={{ animationDelay: '1.2s' }}>
            <Button variant="outline" size="lg" asChild className="transition-transform duration-300 hover:scale-110">
              <Link to="/categories">
                View All Categories
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Secret Admin Button */}
      <div className="fixed bottom-4 right-4">
        <Link to="/admin">
          <Button 
            variant="outline" 
            size="sm" 
            className="opacity-20 hover:opacity-100 transition-opacity"
          >
            🔐
          </Button>
        </Link>
      </div>
      <section className="container mx-auto px-4 py-8">
        {loadingProducts ? (
          <p className="text-center text-muted-foreground">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-muted-foreground">No products found.</p>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 md:grid-cols-5 sm:overflow-x-visible">
            {products.map((product) => (
              <div className="min-w-[220px] max-w-[240px] flex-shrink-0 sm:min-w-0 sm:max-w-none" key={product._id || product.id}>
                <ProductCard
                  product={{
                    id: product._id || product.id,
                    name_en: product.name_en,
                    name_ta: product.name_ta,
                    price: product.price,
                    original_price: product.original_price,
                    image_url: product.imageUrl || product.image_url, // This line is correct!
                    category: product.category,
                    youtube_url: product.youtube_url,
                  }}
                  onAddToCart={addToCart}
                  size="sm"
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Sparkler Products Section */}
      <section className="container mx-auto px-4 py-8">
        {loadingSparklers ? (
          <p className="text-center text-muted-foreground">Loading products...</p>
        ) : sparklerProducts.length === 0 ? (
          <p className="text-center text-muted-foreground">No sparkler products found.</p>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 md:grid-cols-5 sm:overflow-x-visible">
            {sparklerProducts.map((product) => (
              <div className="min-w-[220px] max-w-[240px] flex-shrink-0 sm:min-w-0 sm:max-w-none" key={product._id || product.id}>
                <ProductCard
                  product={{
                    id: product._id || product.id,
                    name_en: product.name_en,
                    name_ta: product.name_ta,
                    price: product.price,
                    original_price: product.original_price,
                    image_url: product.imageUrl || product.image_url, // This line is correct!
                    category: product.category,
                    youtube_url: product.youtube_url,
                  }}
                  onAddToCart={addToCart}
                  size="sm"
                />
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />

      {/* Featured Products Section */}
     
    </div>
  );
};

export default Index;
