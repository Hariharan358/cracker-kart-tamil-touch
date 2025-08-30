import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { categoryImages } from "../data/mockData";
import { useLanguage } from "../contexts/LanguageContext";
import sparklerImg from '../assets/categories/sparkler.jpg';

interface CategoryCardProps {
  category: string;
  displayName?: string;
  displayNameTa?: string;
  productCount?: number;
  iconUrl?: string;
}

export const CategoryCard = ({ category, displayName, displayNameTa, productCount = 0, iconUrl }: CategoryCardProps) => {
  const { t } = useLanguage();
  
  // Use the display name if available, otherwise fall back to the category name
  const displayText = displayName || category;
  
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
              src={iconUrl || categoryImages[category] || sparklerImg}
              alt={displayText}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.log(`❌ Image failed to load for ${category}:`, iconUrl);
                (e.target as HTMLImageElement).src = categoryImages[category] || sparklerImg;
              }}
              onLoad={() => {
                if (iconUrl) {
                  console.log(`✅ Image loaded successfully for ${category}:`, iconUrl);
                }
              }}
            />
          </div>
          
          {/* Category Name */}
          <div className="space-y-1">
            <h3 className="font-semibold text-sm sm:text-base md:text-lg text-foreground group-hover:text-primary transition-colors truncate leading-tight">
              {displayText}
            </h3>
            {displayNameTa && (
              <p className="text-xs sm:text-sm text-muted-foreground truncate leading-tight">
                {displayNameTa}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              {productCount} {productCount === 1 ? 'product' : 'products'}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};