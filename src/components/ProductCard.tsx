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
  onRemoveFromCart?: (product: Product) => void;
  quantity?: number;
  size?: "sm" | "md";
}

export const ProductCard = ({
  product,
  onAddToCart,
  onRemoveFromCart,
  quantity = 0,
  size = "md",
}: ProductCardProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    onAddToCart(product);
    setTimeout(() => setIsAdding(false), 600);
  };

  const handleRemoveFromCart = () => {
    if (onRemoveFromCart) {
      setIsRemoving(true);
      onRemoveFromCart(product);
      setTimeout(() => setIsRemoving(false), 600);
    }
  };

  const isDiscount =
    product.original_price && product.original_price > product.price;

  return (
    <div
      className={`bg-gradient-card rounded-xl shadow-card hover:shadow-glow hover:scale-[1.025] transition-all duration-300 border-2 border-primary/40 hover:border-primary/80 overflow-hidden group ${size === "sm" ? "p-2" : "p-0"}`}
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
      <div className={`${size === "sm" ? "p-2 space-y-1" : "p-5 space-y-3"}`}>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            <h3
              className={`font-extrabold ${size === "sm" ? "text-base" : "text-xl"} text-foreground leading-tight tracking-tight`}
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
            className={`text-[0.97rem] text-accent font-medium ${size === "sm" ? "truncate" : ""}`}
          >
            {product.name_ta}
          </p>
        </div>

        {/* Price and Add to Cart */}
        <div className="flex items-end justify-between mt-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              {isDiscount && (
                <span
                  className={`text-muted-foreground line-through ${size === "sm" ? "text-xs" : "text-base"}`}
                >
                  ₹{product.original_price}
                </span>
              )}
              <span
                className={`font-bold text-primary ${size === "sm" ? "text-sm" : "text-2xl"}`}
              >
                ₹{product.price}
              </span>
            </div>
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide mt-1">
              {product.category}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <Button
              variant="cart"
              size="cart-icon"
              onClick={handleRemoveFromCart}
              className={`relative ${isRemoving ? "cart-bounce" : ""}`}
              disabled={isRemoving || quantity === 0}
              aria-label="Remove from cart"
            >
              -
            </Button>
            <span className="font-semibold text-base w-6 text-center select-none">
              {quantity}
            </span>
            <Button
              variant="cart"
              size="cart-icon"
              onClick={handleAddToCart}
              className={`relative ${isAdding ? "cart-bounce" : ""}`}
              disabled={isAdding}
              aria-label="Add to cart"
            >
              <Plus className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} />
              {isAdding && (
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};