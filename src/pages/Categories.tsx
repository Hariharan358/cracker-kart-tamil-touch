import { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { CategoryCard } from "../components/CategoryCard";
import { Footer } from "../components/Footer";
import { useCart } from "../hooks/useCart";
import { useLanguage } from "../contexts/LanguageContext";
import { categoryTranslationKeys } from "../data/mockData";
import { Sparkles, Gift, Users } from "lucide-react";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

const Categories = () => {
  const { getTotalItems } = useCart();
  const { t } = useLanguage();
  const [categoryProductCounts, setCategoryProductCounts] = useState({});
  const [loadingCounts, setLoadingCounts] = useState(true);
  
  // Fetch product counts for all categories
  const fetchCategoryProductCounts = async () => {
    setLoadingCounts(true);
    try {
      const counts = {};
      for (const categoryKey of categoryTranslationKeys) {
        try {
          const res = await fetch(`https://km-crackers.onrender.com/api/products/category/${encodeURIComponent(t(categoryKey))}`);
          const data = await res.json();
          counts[t(categoryKey)] = data.length;
        } catch (err) {
          counts[t(categoryKey)] = 0;
        }
      }
      setCategoryProductCounts(counts);
    } catch (err) {
      console.error('Error fetching category counts:', err);
    } finally {
      setLoadingCounts(false);
    }
  };

  useEffect(() => {
    fetchCategoryProductCounts();
  }, [t]); // Re-fetch when language changes
  
  // Get categories with translated names and actual counts
  const categories = categoryTranslationKeys.map(key => ({
    name: t(key),
    translationKey: key,
    count: loadingCounts ? 0 : (categoryProductCounts[t(key)] || 0)
  }));

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={getTotalItems()} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-primary animate-sparkle mr-2" />
            <h1 className="title-styled text-4xl font-bold text-primary">
              {t('allCategories')}
            </h1>
            <Sparkles className="h-8 w-8 text-primary animate-sparkle ml-2" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto dark:text-foreground/80">
            {t('exploreCategories')}
          </p>
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchCategoryProductCounts}
              disabled={loadingCounts}
              className="text-xs"
            >
              {loadingCounts ? 'Refreshing...' : 'Refresh Counts'}
            </Button>
          </div>
        </div>

        {/* Special Category Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link to="/category/FAMILY%20PACK">
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <Users className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
              {t('familyPack')}
            </Button>
          </Link>
          
          <Link to="/category/GIFT%20BOX">
            <Button 
              size="lg" 
              variant="outline"
              className="w-full sm:w-auto border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <Gift className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
              {t('giftBox')}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.translationKey}
              category={category.name}
              productCount={category.count}
            />
          ))}
        </div>
        
        {loadingCounts && (
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              Loading product counts...
            </p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Categories;