import { Link } from "react-router-dom";
import { Sparkles, Zap, Gift } from "lucide-react";
import { Button } from "../components/ui/button";
import { CategoryCard } from "../components/CategoryCard";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useCart } from "../hooks/useCart";
import { useLanguage } from "../contexts/LanguageContext";
import { getCategoriesWithCount } from "../data/mockData";
import heroImage from "../assets/hero-fireworks.jpg";

const Index = () => {
  const { getTotalItems } = useCart();
  const { t } = useLanguage();
  const categories = getCategoriesWithCount();

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={getTotalItems()} />
      
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden animate-fade-in">
        <div 
          className="absolute inset-0 bg-cover bg-center scale-105 animate-float"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        {/* Animated sparkles overlay */}
        <div className="absolute inset-0 pointer-events-none flex justify-center items-center">
          <Sparkles className="h-24 w-24 text-primary/30 animate-sparkle" />
        </div>
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-center mx-auto">
            <div className="flex items-center justify-center mb-4 space-x-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Sparkles className="h-8 w-8 text-primary animate-sparkle" />
              <Zap className="h-10 w-10 text-accent animate-bounce-gentle" />
              <Sparkles className="h-8 w-8 text-primary animate-sparkle" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <span className="bg-gradient-primary bg-clip-text ">
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
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gradient-card rounded-lg shadow-card hover:shadow-glow transition-all duration-300 animate-slide-up dark:shadow-[0_0_24px_0_hsl(45,100%,60%,0.5)]" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-center mb-4">
                <span className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900/40 shadow-[0_0_16px_0_hsl(45,100%,60%,0.3)]">
                  <Sparkles className="h-12 w-12 text-yellow-500 dark:text-yellow-300 animate-glow" />
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('featureQuality')}</h3>
              <p className="text-muted-foreground">{t('featureQualityDesc')}</p>
            </div>
            <div className="text-center p-6 bg-gradient-card rounded-lg shadow-card hover:shadow-glow transition-all duration-300 animate-slide-up dark:shadow-[0_0_24px_0_hsl(210,100%,60%,0.4)]" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center justify-center mb-4">
                <span className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/40 shadow-[0_0_16px_0_hsl(210,100%,60%,0.3)]">
                  <Zap className="h-12 w-12 text-blue-500 dark:text-blue-300 animate-bounce-gentle" />
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('featureDelivery')}</h3>
              <p className="text-muted-foreground">{t('featureDeliveryDesc')}</p>
            </div>
            <div className="text-center p-6 bg-gradient-card rounded-lg shadow-card hover:shadow-glow transition-all duration-300 animate-slide-up dark:shadow-[0_0_24px_0_hsl(0,100%,60%,0.4)]" style={{ animationDelay: '0.6s' }}>
              <div className="flex items-center justify-center mb-4">
                <span className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/40 shadow-[0_0_16px_0_hsl(0,100%,60%,0.3)]">
                  <Gift className="h-12 w-12 text-red-500 dark:text-red-300 animate-float" />
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('featureOffers')}</h3>
              <p className="text-muted-foreground">{t('featureOffersDesc')}</p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.slice(0, 12).map((category, idx) => (
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

      <Footer />
    </div>
  );
};

export default Index;
