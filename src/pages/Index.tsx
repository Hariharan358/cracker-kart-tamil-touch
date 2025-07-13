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
      <section className="relative h-96 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-center mx-auto">
            <div className="flex items-center justify-center mb-4 space-x-2">
              <Sparkles className="h-8 w-8 text-primary animate-sparkle" />
              <Zap className="h-10 w-10 text-accent animate-bounce-gentle" />
              <Sparkles className="h-8 w-8 text-primary animate-sparkle" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-primary bg-clip-text ">
                MK Crackers
              </span>
            </h1>
            
            <p className="text-xl text-foreground/90 mb-8 leading-relaxed">
              Light up your festivals with premium quality fireworks. 
              Celebrate Diwali with our authentic crackers collection.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="festive" size="lg" asChild>
                <Link to="/categories">
                  <Gift className="mr-2 h-5 w-5" />
                  Shop Now
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" asChild>
                <Link to="/track">
                  Track Your Order
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
            <div className="text-center p-6 bg-gradient-card rounded-lg shadow-card">
              <Sparkles className="h-12 w-12 text-primary mx-auto mb-4 animate-glow" />
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-muted-foreground">Authentic fireworks with the highest safety standards</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-card rounded-lg shadow-card">
              <Zap className="h-12 w-12 text-accent mx-auto mb-4 animate-bounce-gentle" />
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-muted-foreground">Quick and safe delivery to your doorstep</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-card rounded-lg shadow-card">
              <Gift className="h-12 w-12 text-secondary mx-auto mb-4 animate-float" />
              <h3 className="text-xl font-semibold mb-2">Festival Offers</h3>
              <p className="text-muted-foreground">Special discounts for all major festivals</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Explore Our <span className="bg-gradient-primary bg-clip-text ">Categories</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our wide range of premium fireworks for every celebration
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.slice(0, 12).map((category) => (
              <CategoryCard
                key={category.name}
                category={category.name}
                productCount={category.count}
              />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
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
