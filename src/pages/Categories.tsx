import { Navbar } from "../components/Navbar";
import { CategoryCard } from "../components/CategoryCard";
import { Footer } from "../components/Footer";
import { useCart } from "../hooks/useCart";
import { useLanguage } from "../contexts/LanguageContext";
import { getCategoriesWithCount } from "../data/mockData";
import { Sparkles } from "lucide-react";

const Categories = () => {
  const { getTotalItems } = useCart();
  const { t } = useLanguage();
  const categories = getCategoriesWithCount();

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={getTotalItems()} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-primary animate-sparkle mr-2" />
            <h1 className="text-4xl font-bold">
              {t('allCategories')}
            </h1>
            <Sparkles className="h-8 w-8 text-primary animate-sparkle ml-2" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('exploreCategories')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.name}
              category={category.name}
              productCount={category.count}
            />
          ))}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Categories;