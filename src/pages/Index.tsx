import { Link } from "react-router-dom";
import { Sparkles, Zap, Gift, Users } from "lucide-react";
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
import '../index.css'; // Ensure global styles are loaded
import { useTheme } from "next-themes";
import { Loader } from "../components/ui/loader";

const Index = () => {
  const { getTotalItems, addToCart, cartItems, updateQuantity } = useCart();
  const { t } = useLanguage();
  const categories = getCategoriesWithCount();
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [sparklerProducts, setSparklerProducts] = useState([]);
  const [loadingSparklers, setLoadingSparklers] = useState(true);
  const location = useLocation();
  const { resolvedTheme } = useTheme();

  const sliderImages = [
    '/banner.jpg',
    '/banner1.jpg',
    '/banner2.jpg',
  ];
  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
    if (resolvedTheme === 'dark') return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [resolvedTheme]);

  useEffect(() => {
    // Fetch products from a default category or all categories
    const fetchProducts = async () => {
      try {
        // Example: fetch from 'ATOM BOMB' category, or change as needed
        const res = await fetch("https://km-crackers.onrender.com/api/products/category/ATOM%20BOMB");
        const data = await res.json();
        setProducts(data.slice(0, 8)); // Show 8 featured products
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
        const res = await fetch("https://km-crackers.onrender.com/api/products/category/SPARKLER%20ITEMS");
        const data = await res.json();
        setSparklerProducts(data.slice(0, 8)); // Show 8 sparkler products
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

      {/* Discount Marquee Banner */}
      <div className="relative w-full overflow-hidden bg-primary py-2">
        <div className="marquee whitespace-nowrap text-white font-bold text-sm sm:text-lg tracking-wide">
          <span className="mx-4 sm:mx-8">🔥 Festival Offer: 10% OFF on all products! 🔥</span>
          <span className="mx-4 sm:mx-8">🔥 Festival Offer: 10% OFF on all products! 🔥</span>
        </div>
      </div>

      {/* Hero Section with Local Video Background */}
      <div className="relative min-h-[60vh] sm:min-h-[70vh] md:min-h-[60vh] flex flex-col justify-center items-center overflow-hidden">
        {/* Dynamic Background based on theme */}
        <div className="absolute inset-0 z-0 w-full h-full overflow-hidden pointer-events-none">
          {resolvedTheme === 'dark' ? (
            // Dark theme: Video background
            <video
              className="w-full h-full object-cover object-center"
              src="/dark_bg.mp4"
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            // Light theme: Banner image background
            <img
              src="/banner.jpg"
              alt="Hero Banner"
              className="w-full h-full object-cover object-center scale-125 sm:scale-110 md:scale-100 hero-bg-image"
            />
          )}
          {resolvedTheme === 'dark' && (
            <div className="absolute inset-0 bg-black/50"></div>
          )}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center hero-content">
          <div className="max-w-2xl text-center mx-auto w-full">
            <div className="flex items-center justify-center mb-4 space-x-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-primary animate-sparkle" />
              <Zap className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-accent animate-bounce-gentle" />
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-primary animate-sparkle" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-6 animate-slide-up hero-title" style={{ animationDelay: '0.3s' }}>
              <span className="title-styled text-white hero-title-contrast">
                {t('heroTitle')}
              </span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white mb-4 sm:mb-6 md:mb-8 leading-relaxed animate-fade-in px-2 hero-description" style={{ animationDelay: '0.5s' }}>
              Minimum Order Rs 1,000/-<br/>
              The Product Image is only for your reference, the packing and brand may change<br/>
              Crackers In Sivakasi,Best Crackers Sivakasi,Crackers in India
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center animate-fade-in px-4" style={{ animationDelay: '0.7s' }}>
              <Button variant="festive" size="lg" asChild className="transition-transform duration-300 hover:scale-110 text-sm md:text-base">
                <Link to="/categories">
                  <Gift className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  {t('shopNow')}
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="transition-transform duration-300 hover:scale-105 text-sm md:text-base">
                <Link to="/track">
                  {t('trackYourOrder')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-12 sm:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center p-4 sm:p-6 bg-gradient-card dark:bg-gradient-card rounded-lg shadow-card hover:shadow-glow transition-all duration-300 animate-slide-up dark:shadow-[0_0_24px_0_hsl(45,100%,60%,0.5)]" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-center mb-3 sm:mb-4">
                <span className="inline-flex items-center justify-center h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-yellow-100 dark:bg-yellow-900/40 shadow-[0_0_16px_0_hsl(45,100%,60%,0.3)]">
                  <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 md:h-12 md:w-12 text-yellow-500 dark:text-yellow-300 animate-glow" />
                </span>
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2 text-foreground dark:text-yellow-100">{t('featureQuality')}</h3>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground dark:text-yellow-200/80">{t('featureQualityDesc')}</p>
            </div>
            <div className="text-center p-4 sm:p-6 bg-gradient-card dark:bg-gradient-card rounded-lg shadow-card hover:shadow-glow transition-all duration-300 animate-slide-up dark:shadow-[0_0_24px_0_hsl(210,100%,60%,0.4)]" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center justify-center mb-3 sm:mb-4">
                <span className="inline-flex items-center justify-center h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-blue-100 dark:bg-blue-900/40 shadow-[0_0_16px_0_hsl(210,100%,60%,0.3)]">
                  <Zap className="h-6 w-6 sm:h-8 sm:w-8 md:h-12 md:w-12 text-blue-500 dark:text-blue-300 animate-bounce-gentle" />
                </span>
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2 text-foreground dark:text-blue-100">{t('featureDelivery')}</h3>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground dark:text-blue-200/80">{t('featureDeliveryDesc')}</p>
            </div>
            <div className="text-center p-4 sm:p-6 bg-gradient-card dark:bg-gradient-card rounded-lg shadow-card hover:shadow-glow transition-all duration-300 animate-slide-up dark:shadow-[0_0_24px_0_hsl(0,100%,60%,0.4)]" style={{ animationDelay: '0.6s' }}>
              <div className="flex items-center justify-center mb-3 sm:mb-4">
                <span className="inline-flex items-center justify-center h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-red-100 dark:bg-red-900/40 shadow-[0_0_16px_0_hsl(0,100%,60%,0.3)]">
                  <Gift className="h-6 w-6 sm:h-8 sm:w-8 md:h-12 md:w-12 text-red-500 dark:text-red-300 animate-glow" />
                </span>
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2 text-foreground dark:text-red-100">{t('featureOffers')}</h3>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground dark:text-red-200/80">{t('featureOffersDesc')}</p>
            </div>
          </div>
          
          {/* Special Category Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 sm:mt-12 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <Link to="/category/FAMILY%20PACK" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <Users className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 group-hover:scale-110 transition-transform duration-300" />
                {t('familyPack')}
              </Button>
            </Link>
            
            <Link to="/category/GIFT%20BOX" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                variant="outline"
                className="w-full sm:w-auto border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <Gift className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 group-hover:scale-110 transition-transform duration-300" />
                {t('giftBox')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              {t('allCategories')}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('exploreCategories')}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6">
            {categories.slice(0, 8).map((category, idx) => (
              <div key={category.name} className="animate-fade-in" style={{ animationDelay: `${0.1 + idx * 0.07}s` }}>
                <CategoryCard
                  category={category.name}
                  productCount={category.count}
                />
              </div>
            ))}
          </div>
          <div className="text-center mt-8 sm:mt-12 animate-fade-in" style={{ animationDelay: '1.2s' }}>
            <Button variant="outline" size="lg" asChild className="transition-transform duration-300 hover:scale-110">
              <Link to="/categories">
                View All Categories
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground">Discover our most popular items</p>
        </div>
        
        {loadingProducts ? (
          <div className="py-12">
            <Loader size="md" />
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-muted-foreground">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {products.map((product) => {
              const quantity = cartItems.find(item => item.id === (product._id || product.id))?.quantity || 0;
              return (
                <div key={product._id || product.id}>
                  <ProductCard
                    product={{
                      id: product._id || product.id,
                      name_en: product.name_en,
                      name_ta: product.name_ta,
                      price: product.price,
                      original_price: product.original_price,
                      image_url: product.imageUrl || product.image_url,
                      category: product.category,
                      youtube_url: product.youtube_url,
                    }}
                    onAddToCart={addToCart}
                    onRemoveFromCart={() => updateQuantity(product._id || product.id, quantity - 1)}
                    quantity={quantity}
                    size="sm"
                  />
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Sparkler Products Section */}
      <section className="container mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Sparkler Items</h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground">Light up your celebrations</p>
        </div>
        
        {loadingSparklers ? (
          <div className="py-12">
            <Loader size="md" />
          </div>
        ) : sparklerProducts.length === 0 ? (
          <p className="text-center text-muted-foreground">No sparkler products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {sparklerProducts.map((product) => {
              const quantity = cartItems.find(item => item.id === (product._id || product.id))?.quantity || 0;
              return (
                <div key={product._id || product.id}>
                  <ProductCard
                    product={{
                      id: product._id || product.id,
                      name_en: product.name_en,
                      name_ta: product.name_ta,
                      price: product.price,
                      original_price: product.original_price,
                      image_url: product.imageUrl || product.image_url,
                      category: product.category,
                      youtube_url: product.youtube_url,
                    }}
                    onAddToCart={addToCart}
                    onRemoveFromCart={() => updateQuantity(product._id || product.id, quantity - 1)}
                    quantity={quantity}
                    size="sm"
                  />
                </div>
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Index;
