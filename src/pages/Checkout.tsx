import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { useCart } from "../hooks/useCart";
import { useToast } from "../hooks/use-toast";
import { useLanguage } from "../contexts/LanguageContext";

interface CheckoutForm {
  fullName: string;
  mobile: string;
  email: string;
  address: string;
  pincode: string;
}

// Generate formatted date as ddmmyyyy
const getFormattedDate = (): string => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = String(now.getFullYear());
  return `${day}${month}${year}`;
};

// Generate unique order ID per day
const generateOrderId = (): string => {
  const today = getFormattedDate();
  const storedDate = localStorage.getItem("order_date");
  let counter = parseInt(localStorage.getItem("order_counter") || "1");

  if (storedDate !== today) {
    counter = 1;
  }

  localStorage.setItem("order_date", today);
  localStorage.setItem("order_counter", (counter + 1).toString());

  return `${today}${String(counter).padStart(2, "0")}`;
};

const Checkout = () => {
  const { cartItems, getTotalItems, getTotalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<CheckoutForm>({
    fullName: "",
    mobile: "",
    email: "",
    address: "",
    pincode: "",
  });

  const handleInputChange = (field: keyof CheckoutForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.fullName || !form.mobile || !form.email || !form.address || !form.pincode) {
      toast({
        title: "Please fill all fields",
        description: "All fields are required to place your order.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const orderId = generateOrderId();

      const orderDetails = {
        orderId,
        items: cartItems,
        total: getTotalPrice(),
        customerDetails: form,
        status: "confirmed",
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(`order_${orderId}`, JSON.stringify(orderDetails));
      clearCart();

      toast({
        title: "Order placed successfully!",
        description: `Your order ID is ${orderId}. You can track your order status.`,
        duration: 5000,
      });

      setIsSubmitting(false);
      navigate(`/track?orderId=${orderId}&mobile=${form.mobile}`);
    }, 2000);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar cartCount={0} />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Button variant="festive" onClick={() => navigate("/categories")}>
            Start Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={getTotalItems()} />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">
          <span className="bg-gradient-primary bg-clip-text text-transparent">Checkout</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="bg-gradient-card rounded-lg p-6 shadow-card border border-border">
            <h2 className="text-xl font-semibold mb-6">Delivery Information</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={form.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="mobile">{t('mobileNumber')} *</Label>
                <Input
                  id="mobile"
                  type="tel"
                  value={form.mobile}
                  onChange={(e) => handleInputChange("mobile", e.target.value)}
                  placeholder="Enter your mobile number"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">{t('email')} *</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div>
                <Label htmlFor="address">Delivery Address *</Label>
                <Textarea
                  id="address"
                  value={form.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter your complete delivery address"
                  required
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="pincode">Pincode *</Label>
                <Input
                  id="pincode"
                  type="text"
                  value={form.pincode}
                  onChange={(e) => handleInputChange("pincode", e.target.value)}
                  placeholder="Enter your pincode"
                  required
                />
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Payment Method</h3>
                <p className="text-sm text-muted-foreground">
                  💵 Cash on Delivery (COD) - Pay when your order arrives
                </p>
              </div>

              <Button
                type="submit"
                variant="festive"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Placing Order..." : "Place Order"}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-gradient-card rounded-lg p-6 shadow-card border border-border h-fit">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex-1">
                    <p className="font-medium">{item.name_en}</p>
                    <p className="text-sm text-muted-foreground">{item.name_ta}</p>
                    <p className="text-sm">Qty: {item.quantity} × ₹{item.price}</p>
                  </div>
                  <span className="font-semibold">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal ({getTotalItems()} items):</span>
                <span>₹{getTotalPrice()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery:</span>
                <span className="text-green-500">Free</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-border pt-2">
                <span>Total:</span>
                <span className="text-primary">₹{getTotalPrice()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
