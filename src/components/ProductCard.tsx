import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { FaYoutube } from "react-icons/fa";

interface Product {
id: string;
name_en: string;
name_ta: string;
price: number;
original_price?: number;
image_url: string;
category: string;
youtube_url?: string;
}

interface ProductCardProps {
product: Product;
onAddToCart: (product: Product) => void;
size?: "sm" | "md";
}

export const ProductCard = ({
product,
onAddToCart,
size = "md",
}: ProductCardProps) => {
const [isAdding, setIsAdding] = useState(false);

const handleAddToCart = () => {
setIsAdding(true);
onAddToCart(product);
setTimeout(() => setIsAdding(false), 600);
};

const isDiscount =
product.original_price && product.original_price > product.price;

return (
  <div
    className={`bg-gradient-card rounded-lg shadow-card hover:shadow-glow hover-lift transition-all duration-300 border border-border overflow-hidden group ${size === "sm" ? "p-2" : ""}`}
  >
    {/* Product Image */}
    <div
      className={`relative ${size === "sm" ? "h-28" : "h-48"} bg-muted overflow-hidden`}
    >
      <img
        src={product.image_url}
        alt={product.name_en}
        className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${size === "sm" ? "rounded-md" : ""}`}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src =
            "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=200&fit=crop";
        }}
      />
      <div className="absolute inset-0 bg-gradient-hero opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
    </div>

    {/* Product Details */}
    <div className={`${size === "sm" ? "p-2 space-y-1" : "p-4 space-y-3"}`}>
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-2">
          <h3
            className={`font-semibold ${size === "sm" ? "text-base" : "text-lg"} text-foreground leading-tight`}
          >
            {product.name_en}
          </h3>
          {product.youtube_url && (
            <a
              href={product.youtube_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 hover:text-red-700"
              title="Watch on YouTube"
            >
              <FaYoutube size={size === "sm" ? 16 : 20} />
            </a>
          )}
        </div>
        <p
          className={`text-sm text-accent font-medium ${size === "sm" ? "truncate" : ""}`}
        >
          {product.name_ta}
        </p>
      </div>

      {/* Price and Add to Cart */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isDiscount && (
            <span
              className={`text-muted-foreground line-through ${size === "sm" ? "text-xs" : "text-sm"}`}
            >
              ₹{product.original_price}
            </span>
          )}
          <span
            className={`font-bold text-foreground ${size === "sm" ? "text-sm" : "text-lg"}`}
          >
            ₹{product.price}
          </span>
        </div>

        <Button
          variant="cart"
          size="cart-icon"
          onClick={handleAddToCart}
          className={`relative ${isAdding ? "cart-bounce" : ""}`}
          disabled={isAdding}
        >
          <Plus className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} />
          {isAdding && (
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
          )}
        </Button>
      </div>
    </div>
  </div>
);
};