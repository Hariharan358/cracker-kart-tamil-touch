import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

interface Product {
  id: string;
  name_en: string;
  name_ta: string;
  price: number;
  image_url: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    onAddToCart(product);
    setTimeout(() => setIsAdding(false), 600);
  };

  return (
    <div className="bg-gradient-card rounded-lg shadow-card hover:shadow-glow hover-lift transition-all duration-300 border border-border overflow-hidden group">
      {/* Product Image */}
      <div className="relative h-48 bg-muted overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name_en}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=200&fit=crop';
          }}
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
      </div>

      {/* Product Details */}
      <div className="p-4 space-y-3">
        {/* Product Names */}
        <div className="space-y-1">
          <h3 className="font-semibold text-lg text-foreground leading-tight">
            {product.name_en}
          </h3>
          <p className="text-sm text-accent font-medium">
            {product.name_ta}
          </p>
        </div>

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <span className="text-2xl font-bold text-primary">₹</span>
            <span className="text-2xl font-bold text-foreground">{product.price}</span>
          </div>
          
          <Button
            variant="cart"
            size="cart-icon"
            onClick={handleAddToCart}
            className={`relative ${isAdding ? 'cart-bounce' : ''}`}
            disabled={isAdding}
          >
            <Plus className="h-5 w-5" />
            {isAdding && (
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};