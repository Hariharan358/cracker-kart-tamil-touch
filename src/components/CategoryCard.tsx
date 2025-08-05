import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { categoryImages } from "../data/mockData";
import { useLanguage } from "../contexts/LanguageContext";
import sparklerImg from '../assets/categories/sparkler.jpg';

interface CategoryCardProps {
  category: string;
  productCount: number;
}

export const CategoryCard = ({ category, productCount }: CategoryCardProps) => {
  const { t } = useLanguage();
  
  return (
    <Link to={`/category/${encodeURIComponent(category)}`}>
      <div className="group relative bg-gradient-card rounded-lg p-3 sm:p-4 md:p-6 hover-lift shadow-card hover:shadow-glow transition-all duration-300 border border-border">
        {/* Sparkle effect */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary animate-sparkle" />
        </div>
        
        <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
          {/* Category Image */}
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-primary group-hover:animate-bounce-gentle">
            <img 
              src={categoryImages[category] || sparklerImg}
              alt={category}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Category Name */}
          <h3 className="font-semibold text-sm sm:text-base md:text-lg text-foreground group-hover:text-primary transition-colors truncate leading-tight">
            {category}
          </h3>
        </div>
      </div>
    </Link>
  );
};