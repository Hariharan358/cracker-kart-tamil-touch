import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { useCart } from "../hooks/useCart";
import { useLanguage } from "../contexts/LanguageContext";
import { useToast } from "../hooks/use-toast";

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getTotalItems, getTotalPrice } = useCart();
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: string, productName: string) => {
    removeFromCart(productId);
    toast({
      title: "Item removed",
      description: `${productName} has been removed from your cart.`,
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={getTotalItems()} />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">
          Your <span className="title-styled text-primary">Cart</span>
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">Add some fireworks to light up your celebration!</p>
            <Button variant="festive" asChild>
              <Link to="/categories">
                Start Shopping
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-gradient-card rounded-lg p-6 shadow-card border border-border">
                  <div className="flex items-center space-x-4">
                    {/* Product Image */}
                    <img
                      src={item.image_url}
                      alt={item.name_en}
                      className="w-20 h-20 object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=80&h=80&fit=crop';
                      }}
                    />
                    
                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.name_en}</h3>
                      <p className="text-sm text-accent">{item.name_ta}</p>
                      <p className="text-lg font-bold text-primary">₹{item.price}</p>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      
                      <span className="w-12 text-center font-semibold">
                        {item.quantity}
                      </span>
                      
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem(item.id, item.name_en)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Item Total */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span className="text-xl font-bold text-primary">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-card rounded-lg p-6 shadow-card border border-border sticky top-24">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>Items ({getTotalItems()}):</span>
                    <span>₹{getTotalPrice()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery:</span>
                    <span className="text-green-500">Free</span>
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-primary">₹{getTotalPrice()}</span>
                    </div>
                  </div>
                </div>
                
                {getTotalPrice() < 1000 && (
                  <div className="text-red-600 text-sm font-semibold mb-2 text-center">
                    {t('minOrderAlert')}
                  </div>
                )}
                <Button
                  variant="festive"
                  className="w-full"
                  asChild
                  disabled={getTotalPrice() < 1000}
                  onClick={() => {
                    if (getTotalPrice() < 1000) {
                      toast({
                        title: t('minOrderButton'),
                        description: t('minOrderAlert'),
                        variant: 'destructive',
                      });
                    }
                  }}
                >
                  <Link to={getTotalPrice() >= 1000 ? "/checkout" : "#"}>
                    {t('proceedToCheckout')}
                  </Link>
                </Button>
                
                <Button variant="outline" className="w-full mt-3" asChild>
                  <Link to="/categories">
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Cart;