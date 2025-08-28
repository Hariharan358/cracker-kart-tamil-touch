import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useCart } from "../hooks/useCart";
import { useLanguage } from "../contexts/LanguageContext";
import { CategoryCard } from "../components/CategoryCard";
import { useToast } from "../hooks/use-toast";

interface Category {
  name: string;
  displayName?: string;
  displayName_en?: string;
  displayName_ta?: string;
  productCount?: number;
}

const Categories = () => {
  const { getTotalItems } = useCart();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Add cache-busting parameter to ensure fresh data
      const timestamp = Date.now();
      const res = await fetch(`https://api.kmpyrotech.com/api/categories/public?t=${timestamp}`);
      
      if (!res.ok) {
        throw new Error(`Failed to fetch categories: ${res.status}`);
      }
      
      const data = await res.json();
      
      // Transform the data to match the expected format
      const transformedCategories = data.map((cat: any) => ({
        name: cat.name,
        displayName: cat.displayName || cat.displayName_en || cat.name,
        displayName_en: cat.displayName_en || cat.displayName || cat.name,
        displayName_ta: cat.displayName_ta || "",
        productCount: cat.productCount || 0
      }));
      
      setCategories(transformedCategories);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
      toast({
        title: "❌ Error",
        description: "Failed to load categories. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) {
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
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading categories...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
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
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">Failed to load categories</p>
            <Button onClick={fetchCategories} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
        
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No categories found</p>
            <Button onClick={fetchCategories} variant="outline">
              Refresh
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {categories.map((category, idx) => (
              <div key={category.name} className="animate-fade-in" style={{ animationDelay: `${0.1 + idx * 0.07}s` }}>
                <CategoryCard
                  category={category.name}
                  displayName={category.displayName || category.displayName_en || category.name}
                  displayNameTa={category.displayName_ta}
                  productCount={category.productCount || 0}
                />
              </div>
            ))}
          </div>
        )}
        
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