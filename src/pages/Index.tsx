import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Loader } from '../components/ui/loader';
import { ProductCard } from '../components/ProductCard';
import { useCart } from '../hooks/useCart';
import { useIsMobile } from '../hooks/use-mobile';
import { useLanguage } from '../contexts/LanguageContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { 
  Sparkles, 
  Zap, 
  Gift, 
  Users, 
  ArrowRight,
  Star,
  Shield,
  Truck,
  Clock,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

import '../index.css'; // Ensure global styles are loaded
import { useTheme } from "next-themes";

const Index = () => {
  const { addToCart, cartItems, updateQuantity, getTotalItems } = useCart();
  const { t, language } = useLanguage();
  const isMobile = useIsMobile();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [error, setError] = useState(null);
  const { resolvedTheme } = useTheme();
  const [videoError, setVideoError] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchProducts(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      console.log('🔄 Index: Fetching categories...');
      const res = await fetch('https://api.kmpyrotech.com/api/categories/public');
      const data = await res.json();
      
      console.log('📋 Index: Categories response:', data);
      console.log('📊 Index: Categories count:', data.length);
      
      if (res.ok) {
        setCategories(data);
        setError(null);
        console.log('✅ Index: Categories set successfully');
        
        // Auto-select first category if available
        if (data.length > 0 && !selectedCategory) {
          console.log('✅ Index: Auto-selecting first category:', data[0].name);
          setSelectedCategory(data[0].name);
        }
      } else {
        console.error('❌ Index: Categories fetch failed:', data.error);
        setError(data.error || 'Failed to fetch categories');
      }
    } catch (err) {
      console.error('❌ Index: Categories fetch error:', err);
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (categoryName) => {
    try {
      setLoadingProducts(true);
      console.log('🔄 Fetching products for category:', categoryName);
      const res = await fetch(`https://api.kmpyrotech.com/api/products/category/${encodeURIComponent(categoryName)}`);
      const data = await res.json();
      
      console.log('📦 Products response:', data);
      
      if (res.ok) {
        setProducts(data);
        console.log(`✅ Loaded ${data.length} products for ${categoryName}`);
      } else {
        console.error('❌ Products fetch failed:', data.error);
        setProducts([]);
      }
    } catch (err) {
      console.error('❌ Products fetch error:', err);
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleCategorySelect = (categoryName) => {
    console.log('🎯 Category selected:', categoryName);
    setSelectedCategory(categoryName);
    fetchProducts(categoryName);
  };

  return (
    <div className="min-h-screen bg-gradient-background light-pattern">
      <Navbar cartCount={getTotalItems()} />

      {/* Discount Marquee Banner */}
      <div className="relative w-full overflow-hidden bg-primary py-2">
        <div className="marquee whitespace-nowrap text-white font-bold text-sm sm:text-lg tracking-wide">
          <span className="mx-4 sm:mx-8">🔥 Festival Offer: 10% OFF on all products! 🔥</span>
          <span className="mx-4 sm:mx-8">🔥 DELIVERY AVAILABLE ALL OVER TAMILNADU! 🔥</span>
        </div>
      </div>

      {/* Hero Section with Video Background for Both Themes */}
      <div className="relative min-h-[60vh] sm:min-h-[70vh] md:min-h-[60vh] flex flex-col justify-center items-center overflow-hidden w-full">
        {/* Video Background for Both Themes */}
        <div className="absolute inset-0 z-0 w-full h-full overflow-hidden pointer-events-none">
          {!videoError ? (
            <video
              className="w-full h-full object-cover object-center"
              src="https://res.cloudinary.com/down1eunj/video/upload/v1755967133/u2ao5lvbbyuv3fbnheba.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              onError={() => setVideoError(true)}
            />
          ) : (
            <img 
              src="https://res.cloudinary.com/down1eunj/image/upload/v1755966762/ptcwt0dr0myvyj1geizh.png" 
              alt="Dark Background" 
              className="w-full h-full object-cover object-center"
              onError={() => {
                // If both video and image fail, show a gradient background
                console.warn('Both video and fallback image failed to load');
              }}
            />
          )}
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
            <div className="flex flex-col items-center justify-center sm:mt-[-80px] mb-[-8px] animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <img 
                src="/center-logo.png" 
                alt="KM Pyrotech Logo" 
                className="h-40 w-40 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-72 lg:w-72 xl:h-80 xl:w-80 object-cover shadow-2xl"
                style={{ maxWidth: '90vw' }}
              />
            </div>
            {/* Company Name - moved further down */}
            <div className="flex flex-col items-center justify-center sm:mt-[-50px] mb-0 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <h1 className="alter-text font-bold hero-title text-white hero-title-video">
                 KM PYROTECH
              </h1>
            </div>
            
            {/* Crackers Available 365 Days */}
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white mb-4 md:mb-6 animate-fade-in font-semibold" style={{ animationDelay: '0.5s' }}>
            Light up your festivals with our crackers
            </p>
            
            {/* Contact Information */}
            <div className="mb-4 md:mb-6 animate-fade-in" style={{ animationDelay: '0.55s' }}>
              <div className="flex justify-center">
                <div className="flex items-center space-x-2 bg-orange-500/20 backdrop-blur-sm px-3 py-1 rounded-full border border-orange-400/30">
                  <span className="text-orange-400">📞</span>
                  <span className="font-bold text-sm sm:text-base text-orange-100">+91  9940891416</span>
                </div>
              </div>
            </div>
            
            {/* Minimum Order Amount - moved below mobile number */}
            <div className="mb-6 md:mb-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="inline-flex items-center px-4 py-2 bg-orange-500/90 backdrop-blur-sm rounded-full border border-orange-400/50 shadow-lg">
                <span className="text-white font-bold text-sm sm:text-base md:text-lg">
                  💰 Minimum Order: ₹2,500
                </span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 mb-10 md:gap-4 justify-center animate-fade-in px-4 sm:mb-10" style={{ animationDelay: '0.7s' }}>
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
      <section className="py-6 sm:py-8 lg:py-12 bg-gradient-to-b from-muted/40 to-muted/20">
        <div className="w-full px-3 sm:px-4">
          <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6">
            <div className="text-center p-2 sm:p-3 md:p-4 lg:p-6 bg-gradient-card rounded-lg shadow-card hover:shadow-glow transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-center mb-2 sm:mb-3 md:mb-4">
                <span className="inline-flex items-center justify-center h-6 w-6 sm:h-8 sm:w-8 md:h-12 md:w-12 lg:h-16 lg:w-16 rounded-full bg-yellow-100 dark:bg-yellow-900/40 shadow-[0_0_16px_0_hsl(45,100%,60%,0.3)]">
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 md:h-6 md:w-6 lg:h-8 lg:w-8 text-yellow-500 dark:text-yellow-300 animate-glow" />
                </span>
              </div>
              <h3 className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-semibold mb-1 sm:mb-2 text-foreground dark:text-yellow-100">{t('featureQuality')}</h3>
              <p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-muted-foreground dark:text-yellow-200/80 hidden sm:block">{t('featureQualityDesc')}</p>
            </div>
            <div className="text-center p-2 sm:p-3 md:p-4 lg:p-6 bg-gradient-card rounded-lg shadow-card hover:shadow-glow transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center justify-center mb-2 sm:mb-3 md:mb-4">
                <span className="inline-flex items-center justify-center h-6 w-6 sm:h-8 sm:w-8 md:h-12 md:w-12 lg:h-16 lg:w-16 rounded-full bg-blue-100 dark:bg-blue-900/40 shadow-[0_0_16px_0_hsl(210,100%,60%,0.3)]">
                  <Zap className="h-3 w-3 sm:h-4 sm:w-4 md:h-6 md:w-6 lg:h-8 lg:w-8 text-blue-500 dark:text-blue-300 animate-bounce-gentle" />
                </span>
              </div>
              <h3 className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-semibold mb-1 sm:mb-2 text-foreground dark:text-blue-100">{t('featureDelivery')}</h3>
              <p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-muted-foreground dark:text-blue-200/80 hidden sm:block">{t('featureDeliveryDesc')}</p>
            </div>
            <div className="text-center p-2 sm:p-3 md:p-4 lg:p-6 bg-gradient-card rounded-lg shadow-card hover:shadow-glow transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <div className="flex items-center justify-center mb-2 sm:mb-3 md:mb-4">
                <span className="inline-flex items-center justify-center h-6 w-6 sm:h-8 sm:w-8 md:h-12 md:w-12 lg:h-16 lg:w-16 rounded-full bg-red-100 dark:bg-red-900/40 shadow-[0_0_16px_0_hsl(0,100%,60%,0.3)]">
                  <Gift className="h-3 w-3 sm:h-4 sm:w-4 md:h-6 md:w-6 lg:h-8 lg:w-8 text-red-500 dark:text-red-300 animate-glow" />
                </span>
              </div>
              <h3 className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-semibold mb-1 sm:mb-2 text-foreground dark:text-red-100">{t('featureOffers')}</h3>
              <p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-muted-foreground dark:text-red-200/80 hidden sm:block">{t('featureOffersDesc')}</p>
            </div>
          </div>
          
          {/* Special Category Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-6 sm:mt-8 lg:mt-12 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <Link to="/category/FAMILY%20PACK" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 text-sm sm:text-base lg:text-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <Users className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 mr-2 sm:mr-3 group-hover:scale-110 transition-transform duration-300" />
                {t('familyPack')}
              </Button>
            </Link>
            
            <Link to="/category/GIFT%20BOX" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                variant="outline"
                className="w-full sm:w-auto border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 text-sm sm:text-base lg:text-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <Gift className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 mr-2 sm:mr-3 group-hover:scale-110 transition-transform duration-300" />
                {t('giftBox')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories and Products Section */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="w-full px-3 sm:px-4">
          <div className="text-center mb-6 sm:mb-8 lg:mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
              <span className="title-styled text-primary">Shop by Category</span>
            </h2>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-muted-foreground">Browse our products by category</p>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-8 sm:py-12">
              <Loader className="h-6 w-6 sm:h-8 sm:w-8" />
              <span className="ml-2 text-muted-foreground text-xs sm:text-sm">Loading categories...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8 sm:py-12">
              <p className="text-red-500 mb-3 sm:mb-4 text-xs sm:text-sm">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline" size="sm" className="text-xs sm:text-sm">
                Try Again
              </Button>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <h3 className="text-base sm:text-lg font-semibold mb-2">No Categories Found</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Check back later for available categories.</p>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
              {/* Left Sidebar - Categories */}
              <div className="w-full lg:w-64 bg-card border border-border rounded-lg p-3 sm:p-4 overflow-y-auto">
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Categories</h3>
                  
                  {/* Mobile Dropdown for Categories */}
                  {isMobile ? (
                    <div className="relative">
                      {/* Dropdown Button */}
                      <Button 
                        onClick={() => {
                          console.log('🖱️ Index: Dropdown clicked!');
                          console.log('📊 Index: Current categories:', categories);
                          console.log('📊 Index: Categories length:', categories.length);
                          setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
                        }} 
                        variant="outline" 
                        className="w-full justify-between bg-white hover:bg-gray-50 text-xs sm:text-sm"
                      >
                        <span className="text-left">
                          {selectedCategory ? 
                            categories.find(c => c.name === selectedCategory)?.displayName : 
                            'Select a category'
                          }
                        </span>
                        {isCategoryDropdownOpen ? (
                          <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4 ml-2" />
                        ) : (
                          <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 ml-2" />
                        )}
                      </Button>
                      
                      {/* Dropdown Menu with Categories */}
                      {isCategoryDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                          {/* Debug Info */}
                          <div className="p-2 bg-gray-100 text-xs text-gray-600 border-b">
                            Categories loaded: {categories.length} | Selected: {selectedCategory}
                          </div>
                          
                          {categories.length === 0 ? (
                            <div className="p-3 text-center text-gray-500">
                              No categories available
                            </div>
                          ) : (
                            categories.map((category) => (
                              <button
                                key={category.name}
                                onClick={() => {
                                  handleCategorySelect(category.name);
                                  setIsCategoryDropdownOpen(false);
                                }}
                                className={`w-full text-left p-2 sm:p-3 hover:bg-gray-100 transition-colors ${
                                  selectedCategory === category.name
                                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-500'
                                    : 'text-gray-700'
                                }`}
                              >
                                <div className="font-medium text-xs sm:text-sm">
                                  {category.displayName || category.name}
                                </div>
                              </button>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    // Desktop: Show all categories
                    <>
                      <Button 
                        onClick={() => window.location.reload()} 
                        variant="outline" 
                        size="sm"
                        className="w-full text-xs sm:text-sm"
                      >
                        Refresh
                      </Button>
                      
                      <div className="space-y-2 mt-3 sm:mt-4">
                        {categories.map((category) => (
                          <button
                            key={category.name}
                            onClick={() => handleCategorySelect(category.name)}
                            className={`w-full text-left p-2 sm:p-3 rounded-lg transition-all duration-200 hover:bg-accent ${
                              selectedCategory === category.name
                                ? 'bg-primary text-primary-foreground shadow-md'
                                : 'bg-background hover:bg-accent'
                            }`}
                          >
                            <div className={`font-medium text-xs sm:text-sm ${
                              selectedCategory === category.name ? 'text-primary-foreground' : 'text-foreground'
                            }`}>
                              {category.displayName}
                            </div>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Right Side - Products */}
              <div className="flex-1">
                {selectedCategory ? (
                  <div>
                    <div className="mb-4 sm:mb-6">
                      <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">{selectedCategory}</h2>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Browse products in this category
                      </p>
                    </div>

                    {loadingProducts ? (
                      <div className="flex items-center justify-center py-8 sm:py-12">
                        <Loader className="h-6 w-6 sm:h-8 sm:w-8" />
                        <span className="ml-2 text-muted-foreground text-xs sm:text-sm">Loading products...</span>
                      </div>
                    ) : products.length === 0 ? (
                      <div className="text-center py-8 sm:py-12">
                        <h3 className="text-base sm:text-lg font-semibold mb-2">No Products Found</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          No products available in {selectedCategory} category yet.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
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
                                  imageUrl: product.imageUrl || product.image_url,
                                  category: product.category,
                                  youtube_url: product.youtube_url,
                                }}
                                onAddToCart={addToCart}
                                onRemoveFromCart={() => updateQuantity(product._id || product.id, quantity - 1)}
                                quantity={quantity}
                                size={isMobile ? "sm" : "md"}
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 sm:py-12">
                    <h3 className="text-base sm:text-lg font-semibold mb-2">Select a Category</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Choose a category from the left sidebar to view products
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer showQRCodes={true} />
    </div>
  );
};

export default Index;
