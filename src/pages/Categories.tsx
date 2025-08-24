import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { Button } from "../components/ui/button";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useCart } from "../hooks/useCart";
import { useLanguage } from "../contexts/LanguageContext";
import { Categories as CategoriesComponent } from "../components/Categories";

const Categories = () => {
  const { getTotalItems } = useCart();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={getTotalItems()} />
      
      <div className="w-full h-full">
        <CategoriesComponent />
      </div>
      
      <Footer />
    </div>
  );
};

export default Categories;