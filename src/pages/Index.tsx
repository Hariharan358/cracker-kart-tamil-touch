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
  const [isDesktop, setIsDesktop] = useState(false);
  const { resolvedTheme } = useTheme();

  // Responsive hook for category display
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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
        const res = await fetch("https://crackerbackend-production.up.railway.app/api/products/category/ATOM%20BOMB");
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
        const res = await fetch("https://crackerbackend-production.up.railway.app/api/products/category/SPARKLER%20ITEMS");
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
    <div className="min-h-screen bg-gradient-background light-pattern">
      <Navbar cartCount={getTotalItems()} />

      {/* Discount Marquee Banner */}
      <div className="relative w-full overflow-hidden bg-primary py-2">
        <div className="marquee whitespace-nowrap text-white font-bold text-sm sm:text-lg tracking-wide">
          <span className="mx-4 sm:mx-8">🔥 Festival Offer: 10% OFF on all products! 🔥</span>
          <span className="mx-4 sm:mx-8">🔥 Festival Offer: 10% OFF on all products! 🔥</span>
        </div>
      </div>

      {/* Hero Section with Video Background for Both Themes */}
      <div className="relative min-h-[60vh] sm:min-h-[70vh] md:min-h-[60vh] flex flex-col justify-center items-center overflow-hidden w-full">
        {/* Video Background for Both Themes */}
        <div className="absolute inset-0 z-0 w-full h-full overflow-hidden pointer-events-none">
          <video
            className="w-full h-full object-cover object-center"
            src="/dark_bg.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
          {/* Theme-specific overlays */}
          {resolvedTheme === 'dark' ? (
            // Dark theme overlay - stronger overlay for better text readability
            <>
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40"></div>
            </>
          ) : (
            // Light theme overlay - lighter overlay to maintain video visibility
            <>
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20"></div>
            </>
          )}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full px-4 h-full flex items-center hero-content">
          <div className="max-w-2xl text-center mx-auto w-full">
            <div className="flex items-center justify-center mb-4 space-x-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-primary animate-sparkle" />
              <Zap className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-accent animate-bounce-gentle" />
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-primary animate-sparkle" />
            </div>
            
            {/* Logo */}
            <div className="flex justify-center mb-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <img 
                src="/edited.jpg" 
                alt="KM Pyrotech Logo" 
                className="h-32 w-32 sm:h-40 sm:w-40 md:h-48 md:w-48 lg:h-56 lg:w-56 rounded-full shadow-2xl border-2 border-yellow-500/50 backdrop-blur-sm object-cover"
              />
            </div>
            
            {/* Company Name */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 md:mb-6 animate-slide-up hero-title hero-title-video" style={{ animationDelay: '0.4s' }}>
              <span className="title-styled text-white">
                KM PYROTECH
              </span>
            </h1>
            
            {/* Minimum Order Amount */}
            <div className="mb-4 md:mb-6 animate-fade-in" style={{ animationDelay: '0.45s' }}>
              <div className="inline-flex items-center px-4 py-2 bg-orange-500/90 backdrop-blur-sm rounded-full border border-orange-400/50 shadow-lg">
                <span className="text-white font-bold text-sm sm:text-base md:text-lg">
                  💰 Minimum Order: ₹2,500
                </span>
              </div>
            </div>
            
            {/* Crackers Available 365 Days */}
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white mb-4 md:mb-6 animate-fade-in font-semibold" style={{ animationDelay: '0.5s' }}>
            Light up your festivals with our crackers
            </p>
            
            {/* Contact Information */}
            <div className="mb-6 md:mb-8 animate-fade-in" style={{ animationDelay: '0.55s' }}>
              <div className="flex justify-center">
                <div className="flex items-center space-x-2 bg-orange-500/20 backdrop-blur-sm px-3 py-1 rounded-full border border-orange-400/30">
                  <span className="text-orange-400">📞</span>
                  <span className="font-bold text-sm sm:text-base text-orange-100">+91  9940891416</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center animate-fade-in px-4 sm:mb-10" style={{ animationDelay: '0.6s' }}>
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
      <section className="py-8 sm:py-12 bg-gradient-to-b from-muted/40 to-muted/20">
        <div className="w-full px-4">
          <div className="grid grid-cols-3 md:grid-cols-3 gap-2 sm:gap-6">
            <div className="text-center p-2 sm:p-4 md:p-6 bg-gradient-card rounded-lg shadow-card hover:shadow-glow transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-center mb-2 sm:mb-3 md:mb-4">
                <span className="inline-flex items-center justify-center h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16 rounded-full bg-yellow-100 dark:bg-yellow-900/40 shadow-[0_0_16px_0_hsl(45,100%,60%,0.3)]">
                  <Sparkles className="h-4 w-4 sm:h-6 sm:w-6 md:h-8 md:w-8 text-yellow-500 dark:text-yellow-300 animate-glow" />
                </span>
              </div>
              <h3 className="text-xs sm:text-sm md:text-lg lg:text-xl font-semibold mb-1 sm:mb-2 text-foreground dark:text-yellow-100">{t('featureQuality')}</h3>
              <p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-muted-foreground dark:text-yellow-200/80 hidden sm:block">{t('featureQualityDesc')}</p>
            </div>
            <div className="text-center p-2 sm:p-4 md:p-6 bg-gradient-card rounded-lg shadow-card hover:shadow-glow transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center justify-center mb-2 sm:mb-3 md:mb-4">
                <span className="inline-flex items-center justify-center h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16 rounded-full bg-blue-100 dark:bg-blue-900/40 shadow-[0_0_16px_0_hsl(210,100%,60%,0.3)]">
                  <Zap className="h-4 w-4 sm:h-6 sm:w-6 md:h-8 md:w-8 text-blue-500 dark:text-blue-300 animate-bounce-gentle" />
                </span>
              </div>
              <h3 className="text-xs sm:text-sm md:text-lg lg:text-xl font-semibold mb-1 sm:mb-2 text-foreground dark:text-blue-100">{t('featureDelivery')}</h3>
              <p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-muted-foreground dark:text-blue-200/80 hidden sm:block">{t('featureDeliveryDesc')}</p>
            </div>
            <div className="text-center p-2 sm:p-4 md:p-6 bg-gradient-card rounded-lg shadow-card hover:shadow-glow transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <div className="flex items-center justify-center mb-2 sm:mb-3 md:mb-4">
                <span className="inline-flex items-center justify-center h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16 rounded-full bg-red-100 dark:bg-red-900/40 shadow-[0_0_16px_0_hsl(0,100%,60%,0.3)]">
                  <Gift className="h-4 w-4 sm:h-6 sm:w-6 md:h-8 md:w-8 text-red-500 dark:text-red-300 animate-glow" />
                </span>
              </div>
              <h3 className="text-xs sm:text-sm md:text-lg lg:text-xl font-semibold mb-1 sm:mb-2 text-foreground dark:text-red-100">{t('featureOffers')}</h3>
              <p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-muted-foreground dark:text-red-200/80 hidden sm:block">{t('featureOffersDesc')}</p>
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
        <div className="w-full px-4">
          <div className="text-center mb-8 sm:mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              <span className="title-styled text-primary">Categories</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground">Explore our wide range of fireworks</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.slice(0, isDesktop ? 8 : 6).map((category, index) => (
              <div key={category.name} className="animate-fade-in" style={{ animationDelay: `${0.3 + index * 0.1}s` }}>
                <CategoryCard 
                  category={category.name}
                  productCount={category.count}
                />
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8 sm:mt-12 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <Button variant="outline" size="lg" asChild className="transition-transform duration-300 hover:scale-110">
              <Link to="/categories">
                View More Categories
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="w-full px-4 py-8 sm:py-12">
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
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
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
                      imageUrl: product.imageUrl,
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
      <section className="w-full px-4 py-8 sm:py-12">
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
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
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
                      imageUrl: product.imageUrl,
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

      <Footer showQRCodes={true} />
    </div>
  );
};

export default Index;
