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
import { useFCM } from "../hooks/useFCM";
import { Loader } from "../components/ui/loader";
import { CreditCard } from "../components/ui/credit-card";

interface CheckoutForm {
  fullName: string;
  mobile: string;
  email: string;
  address: string;
  pincode: string;
}

const getFormattedDate = (): string => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = String(now.getFullYear());
  return `${day}${month}${year}`;
};

const generateOrderId = (): string => {
  const today = getFormattedDate();
  const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0"); // Random 3-digit number
  
  return `${today}${timestamp}${random}`;
};

const Checkout = () => {
  const { cartItems, getTotalItems, getTotalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { requestPermission } = useFCM();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invoiceUrl, setInvoiceUrl] = useState<string | null>(null);
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
    if (getTotalPrice() < 1000) {
      toast({
        title: t('minOrderButton'),
        description: t('minOrderAlert'),
        variant: 'destructive',
      });
      return;
    }

    if (!form.fullName || !form.mobile ||  !form.address || !form.pincode) {
      toast({
        title: "Please fill all fields",
        description: "All fields are required to place your order.",
        variant: "destructive",
      });
      return;
    }
    const BASE_URL = "http://localhost:5000";


    setIsSubmitting(true);

    const orderDetails = {
      items: cartItems,
      total: getTotalPrice(),
      customerDetails: form,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    try {
      // Store customer mobile for notifications
      localStorage.setItem('customerMobile', form.mobile);
      
      // Request notification permission for customer
      await requestPermission();
      
      const response = await fetch(`http://localhost:5000/api/orders/place`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderDetails),
      });
      
    
      let result = null;
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        const text = await response.text();
        throw new Error(text || "Server returned an unexpected response");
      }

      if (response.ok) {
        const { orderId } = result;
        clearCart();
        toast({
          title: "Order placed successfully!",
          description: `Your order ID is ${orderId}. Invoice is available for download.`,
          duration: 5000,
        });

        setInvoiceUrl(`${BASE_URL}/invoices/${orderId}.pdf`);
        setIsSubmitting(false);
      } else {
        throw new Error(result.error || "Order failed");
      }
    } catch (error: any) {
      toast({
        title: "Order failed",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  if (invoiceUrl) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar cartCount={0} />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Thank you for your order!</h1>
          <p className="mb-4">Your invoice is ready to download.</p>
          <a href={invoiceUrl} download target="_blank" rel="noopener noreferrer">
            <Button variant="festive" className="mb-4">
              Download Invoice PDF
            </Button>
          </a>
          <br />
          <Button variant="default" onClick={() => navigate("/track")}>
            Track Your Order
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar cartCount={0} />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Button variant="festive" onClick={() => navigate("/categories")}>Start Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={getTotalItems()} />
      
      {/* Full-screen loader overlay when placing order */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-background rounded-lg p-8 shadow-lg border border-border text-center">
            <Loader size="lg" className="mb-4" />
            <h3 className="text-lg font-semibold mb-2">Placing Your Order</h3>
            <p className="text-muted-foreground">Please wait while we process your order...</p>
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">
          <span className="title-styled text-primary">Checkout</span>
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gradient-card rounded-lg p-6 shadow-card border border-border">
            <h2 className="text-xl font-semibold mb-6">Delivery Information</h2>
            
            {/* Credit Card Preview */}
            <div className="mb-6 flex justify-center">
              <CreditCard 
                orderId={generateOrderId()}
                customerName={form.fullName}
                orderDate={new Date().toISOString()}
              />
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input id="fullName" value={form.fullName} onChange={(e) => handleInputChange("fullName", e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="mobile">{t("mobileNumber")} *</Label>
                <Input id="mobile" type="tel" value={form.mobile} onChange={(e) => handleInputChange("mobile", e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="email">{t("email")} *</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => handleInputChange("email", e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="address">Delivery Address *</Label>
                <Textarea id="address" value={form.address} onChange={(e) => handleInputChange("address", e.target.value)} required rows={3} />
              </div>
              <div>
                <Label htmlFor="pincode">Pincode *</Label>
                <Input id="pincode" value={form.pincode} onChange={(e) => handleInputChange("pincode", e.target.value)} required />
              </div>
              {/* Payment Method - REMOVE COD */}
              {/* <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Payment Method</h3>
                <p className="text-sm text-muted-foreground">💵 Cash on Delivery (COD) - Pay when your order arrives</p>
              </div> */}
              <Button type="submit" variant="festive" className="w-full" disabled={isSubmitting || getTotalPrice() < 1000}>
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader size="sm" />
                    <span>Placing Order...</span>
                  </div>
                ) : (
                  t('placeOrder')
                )}
              </Button>
            </form>
          </div>

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
