import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { Button } from "../components/ui/button";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useCart } from "../hooks/useCart";
import { useLanguage } from "../contexts/LanguageContext";
import { getCategoriesWithCount } from "../data/mockData";
import { CategoryCard } from "../components/CategoryCard";

const Categories = () => {
  const { getTotalItems } = useCart();
  const { t } = useLanguage();
  const categories = getCategoriesWithCount();

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={getTotalItems()} />
      
      <div className="w-full px-4 py-8">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="title-styled text-primary">{t('allCategories')}</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('exploreCategories')}
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((category, idx) => (
            <div key={category.name} className="animate-fade-in" style={{ animationDelay: `${0.1 + idx * 0.07}s` }}>
              <CategoryCard
                category={category.name}
                productCount={category.count}
              />
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8 sm:mt-12">
          <Button variant="outline" size="lg" asChild className="transition-transform duration-300 hover:scale-110">
            <Link to="/">
              <Sparkles className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Categories;