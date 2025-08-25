import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { FaYoutube } from "react-icons/fa";

interface Product {
  id: string;
  name_en: string;
  name_ta: string;
  price: number;
  original_price?: number;
  imageUrl?: string;
  image_url?: string;
  category: string;
  youtube_url?: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onRemoveFromCart?: (productId: string) => void;
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
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product);
  };

  const handleRemoveFromCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onRemoveFromCart) {
      onRemoveFromCart(product.id);
    }
  };

  const isDiscount =
    product.original_price && product.original_price > product.price;

  return (
    <div
      className={`bg-gradient-card rounded-xl shadow-card hover:shadow-glow transition-all duration-300 border-2 border-primary/40 hover:border-primary/80 overflow-hidden group ${size === "sm" ? "p-2" : "p-0"}`}
    >
      {/* Product Image */}
      <div
        className={`relative ${size === "sm" ? "h-24 sm:h-28" : "h-44 sm:h-52"} bg-white overflow-hidden flex items-center justify-center`}
      >
        <img
          src={product.imageUrl || product.image_url || '/placeholder.svg'}
          alt={product.name_en}
          className={`max-w-full max-h-full object-contain transition-transform duration-300 ${size === "sm" ? "rounded-md" : ""}`}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            console.log('🖼️ Image failed to load:', product.imageUrl || product.image_url);
            target.src = "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=200&fit=crop";
          }}
          onLoad={() => {
            console.log('✅ Image loaded successfully:', product.imageUrl || product.image_url);
          }}
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
      </div>

      {/* Product Details */}
      <div className={`${size === "sm" ? "p-2 space-y-1" : "p-3 sm:p-5 space-y-2 sm:space-y-3"}`}>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-1 sm:gap-2">
            <h3
              className={`font-extrabold ${size === "sm" ? "text-xs sm:text-sm" : "text-lg sm:text-xl"} text-foreground leading-tight tracking-tight truncate`}
            >
              {product.name_en}
            </h3>
            {product.youtube_url && (
              <a
                href={product.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 hover:text-red-700 flex-shrink-0"
                title="Watch on YouTube"
              >
                <FaYoutube size={size === "sm" ? 12 : 18} />
              </a>
            )}
          </div>
          <p
            className={`text-accent font-medium ${size === "sm" ? "text-xs truncate" : "text-sm sm:text-base truncate"}`}
          >
            {product.name_ta}
          </p>
        </div>

        {/* Price and Add to Cart */}
        <div className="flex items-end justify-between mt-1 sm:mt-2">
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
              {isDiscount && (
                <span
                  className={`text-muted-foreground line-through ${size === "sm" ? "text-xs" : "text-sm sm:text-base"}`}
                >
                  ₹{product.original_price}
                </span>
              )}
              <span
                className={`font-bold text-primary ${size === "sm" ? "text-sm" : "text-lg sm:text-2xl"}`}
              >
                ₹{product.price}
              </span>
            </div>
            <span className={`text-muted-foreground font-medium uppercase tracking-wide ${size === "sm" ? "text-xs" : "text-xs sm:text-sm"}`}>
              {product.category}
            </span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 mt-1 sm:mt-2 flex-shrink-0">
            <Button
              variant="cart"
              size="cart-icon"
              onClick={handleRemoveFromCart}
              className={`${size === "sm" ? "h-6 w-6" : "h-8 w-8"} transition-none hover:scale-100`}
              disabled={quantity === 0}
              aria-label="Remove from cart"
              type="button"
            >
              <span className="text-xs">-</span>
            </Button>
            <span className={`font-semibold text-center select-none ${size === "sm" ? "text-xs w-4" : "text-sm w-6"}`}>
              {quantity}
            </span>
            <Button
              variant="cart"
              size="cart-icon"
              onClick={handleAddToCart}
              className={`${size === "sm" ? "h-6 w-6" : "h-8 w-8"} transition-none hover:scale-100`}
              aria-label="Add to cart"
              type="button"
            >
              <Plus className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};