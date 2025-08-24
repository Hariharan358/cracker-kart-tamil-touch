import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, ShoppingCart, ArrowLeft, Plus, Minus } from "lucide-react";
import { Button } from "../components/ui/button";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useCart } from "../hooks/useCart";
import { useLanguage } from "../contexts/LanguageContext";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalItems, getTotalPrice } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (getTotalPrice() < 2500) {
      // Show minimum order alert
      alert(t('minOrderAlert'));
      return;
    }
    // Navigate to checkout page
    navigate('/checkout');
  };

  const totalPrice = getTotalPrice();
  const isMinimumOrderMet = totalPrice >= 2500;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar cartCount={getTotalItems()} />
        <div className="w-full px-4 py-8">
          <div className="text-center py-16">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">Add some products to get started!</p>
            <Button asChild>
              <Link to="/categories">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
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
      
      <div className="w-full px-3 sm:px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">Shopping Cart</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">{cartItems.length} items</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-card rounded-lg border">
                <img
                  src={item.imageUrl}
                  alt={item.name_en}
                  className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-md"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-xs sm:text-sm md:text-base truncate">{item.name_en}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">₹{item.price}</p>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                  >
                    <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <span className="w-6 sm:w-8 text-center text-xs sm:text-sm">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-xs sm:text-sm md:text-base">₹{item.price * item.quantity}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                    className="text-destructive hover:text-destructive h-7 w-7 sm:h-8 sm:w-8 p-0"
                  >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card p-4 sm:p-6 rounded-lg border sticky top-24">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Order Summary</h2>
              <div className="space-y-2 mb-3 sm:mb-4">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span>Subtotal</span>
                  <span>₹{getTotalPrice()}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold text-xs sm:text-sm">
                    <span>Total</span>
                    <span>₹{getTotalPrice()}</span>
                  </div>
                </div>
              </div>
              <Button 
                onClick={handleCheckout} 
                disabled={!isMinimumOrderMet}
                className="w-full text-xs sm:text-sm"
              >
                {isMinimumOrderMet ? "Continue to Place Order" : t('minOrderButton')}
              </Button>
              {!isMinimumOrderMet && (
                <p className="text-xs sm:text-sm text-muted-foreground mt-2 text-center">
                  {t('minOrderAlert')}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Cart;