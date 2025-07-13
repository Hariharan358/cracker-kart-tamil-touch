import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

interface CategoryCardProps {
  category: string;
  productCount: number;
}

export const CategoryCard = ({ category, productCount }: CategoryCardProps) => {
  return (
    <Link to={`/category/${encodeURIComponent(category)}`}>
      <div className="group relative bg-gradient-card rounded-lg p-6 hover-lift shadow-card hover:shadow-glow transition-all duration-300 border border-border">
        {/* Sparkle effect */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Sparkles className="h-5 w-5 text-primary animate-sparkle" />
        </div>
        
        <div className="flex flex-col items-center text-center space-y-3">
          {/* Category Icon Placeholder */}
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center group-hover:animate-bounce-gentle">
            <span className="text-2xl font-bold text-primary-foreground">
              {category.charAt(0)}
            </span>
          </div>
          
          {/* Category Name */}
          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
            {category}
          </h3>
          
          {/* Product Count */}
          <p className="text-sm text-muted-foreground">
            {productCount} items
          </p>
        </div>
      </div>
    </Link>
  );
};