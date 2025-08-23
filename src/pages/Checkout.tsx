import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, CreditCard, MapPin, User, Phone, Mail, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useCart } from "../hooks/useCart";
import { useTheme } from "next-themes";

const Checkout = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { resolvedTheme } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [selectedQR, setSelectedQR] = useState<{ src: string; title: string } | null>(null);

  // Generate a temporary order ID for display
  const generateTempOrderId = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    return `KM-${timestamp}${random}`;
  };

  const tempOrderId = generateTempOrderId();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // Validate required fields (removed email and pincode from required)
    if (!formData.name || !formData.phone || !formData.address) {
      alert("Please fill in all required fields (Name, Phone, Address)");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        items: cartItems.map(item => ({
          id: item.id,
          name_en: item.name_en,
          price: item.price,
          quantity: item.quantity,
        })),
        total: getTotalPrice(),
        customerDetails: {
          fullName: formData.name,
          email: formData.email || "", // Make email optional
          mobile: formData.phone,
          address: formData.address,
          pincode: formData.pincode || "", // Make pincode optional
        },
        status: "confirmed",
        createdAt: new Date().toISOString(),
      };

      console.log('Sending order data:', orderData);
      console.log('Items length:', orderData.items.length);
      console.log('Total:', orderData.total);
      console.log('Customer details:', orderData.customerDetails);
      console.log('Form data:', formData);
      
      // Validate the order data structure
      if (!orderData.items || orderData.items.length === 0) {
        throw new Error('No items in cart');
      }
      if (!orderData.total || orderData.total <= 0) {
        throw new Error('Invalid total price');
      }
      if (!orderData.customerDetails || !orderData.customerDetails.fullName || !orderData.customerDetails.mobile || !orderData.customerDetails.address) {
        throw new Error('Missing required customer details');
      }

      const response = await fetch('https://api.kmpyrotech.com/api/orders/place', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: Failed to place order`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      setOrderId(result.orderId);
      setIsSubmitted(true);
      clearCart();
    } catch (error) {
      console.error('Error placing order:', error);
      const errorMessage = error.message || 'Failed to place order. Please try again.';
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openQRModal = (src: string, title: string) => {
    setSelectedQR({ src, title });
  };

  const closeQRModal = () => {
    setSelectedQR(null);
  };

  if (cartItems.length === 0 && !isSubmitted) {
    return (
      <div className={`min-h-screen ${resolvedTheme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-black' : 'bg-gradient-to-br from-orange-50 to-red-50'}`}>
        <Navbar cartCount={0} />
        <div className="w-full px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className={`rounded-2xl shadow-lg p-8 ${resolvedTheme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${resolvedTheme === 'dark' ? 'bg-orange-900' : 'bg-orange-100'}`}>
                <CreditCard className={`h-8 w-8 ${resolvedTheme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`} />
              </div>
              <h2 className={`text-2xl font-bold mb-4 ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Your cart is empty</h2>
              <p className={`mb-8 ${resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Add some amazing crackers to your cart and get ready for a spectacular celebration!</p>
              <Button asChild className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                <Link to="/categories">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className={`min-h-screen ${resolvedTheme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-black' : 'bg-gradient-to-br from-green-50 to-emerald-50'}`}>
        <Navbar cartCount={0} />
        <div className="w-full px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className={`rounded-2xl shadow-lg p-8 ${resolvedTheme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${resolvedTheme === 'dark' ? 'bg-green-900' : 'bg-green-100'}`}>
                <CheckCircle className={`h-8 w-8 ${resolvedTheme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
              </div>
              <h2 className={`text-2xl font-bold mb-4 ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Thank you for your order!</h2>
              <p className={`mb-4 ${resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>We'll process your order and contact you soon.</p>
              {orderId && (
                <div className={`rounded-lg p-4 mb-6 ${resolvedTheme === 'dark' ? 'bg-green-900/20 border border-green-700' : 'bg-green-50 border border-green-200'}`}>
                  <p className={`font-semibold ${resolvedTheme === 'dark' ? 'text-green-400' : 'text-green-800'}`}>Order ID: {orderId}</p>
                </div>
              )}
              <Button asChild className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                <Link to="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${resolvedTheme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-black' : 'bg-gradient-to-br from-orange-50 to-red-50'}`}>
      <Navbar cartCount={cartItems.length} />
      
      <div className="w-full px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Complete Your Order
          </h1>
          <p className={`${resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Fill in your details and get ready for an amazing celebration!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Enhanced Order Form */}
          <div className={`rounded-2xl shadow-lg p-8 ${resolvedTheme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
            <div className="flex items-center mb-6">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${resolvedTheme === 'dark' ? 'bg-orange-900' : 'bg-orange-100'}`}>
                <User className={`h-5 w-5 ${resolvedTheme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`} />
              </div>
              <h2 className={`text-2xl font-bold ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Customer Information</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className={`block text-sm font-semibold flex items-center ${resolvedTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    <User className="h-4 w-4 mr-2 text-orange-500" />
                    Full Name *
                  </label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`border-2 transition-colors ${resolvedTheme === 'dark' ? 'border-gray-600 bg-gray-700 text-white focus:border-orange-500 focus:ring-orange-200' : 'border-gray-200 focus:border-orange-500 focus:ring-orange-200'}`}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <label className={`block text-sm font-semibold flex items-center ${resolvedTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    <Mail className="h-4 w-4 mr-2 text-orange-500" />
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`border-2 transition-colors ${resolvedTheme === 'dark' ? 'border-gray-600 bg-gray-700 text-white focus:border-orange-500 focus:ring-orange-200' : 'border-gray-200 focus:border-orange-500 focus:ring-orange-200'}`}
                    placeholder="Enter your email (optional)"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className={`block text-sm font-semibold flex items-center ${resolvedTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                  <Phone className="h-4 w-4 mr-2 text-orange-500" />
                  Phone Number *
                </label>
                <Input
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`border-2 transition-colors ${resolvedTheme === 'dark' ? 'border-gray-600 bg-gray-700 text-white focus:border-orange-500 focus:ring-orange-200' : 'border-gray-200 focus:border-orange-500 focus:ring-orange-200'}`}
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div className="space-y-2">
                <label className={`block text-sm font-semibold flex items-center ${resolvedTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                  <MapPin className="h-4 w-4 mr-2 text-orange-500" />
                  Delivery Address *
                </label>
                <Textarea
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className={`border-2 transition-colors min-h-[80px] ${resolvedTheme === 'dark' ? 'border-gray-600 bg-gray-700 text-white focus:border-orange-500 focus:ring-orange-200' : 'border-gray-200 focus:border-orange-500 focus:ring-orange-200'}`}
                  placeholder="Enter your complete delivery address"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className={`block text-sm font-semibold ${resolvedTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    City *
                  </label>
                  <Input
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className={`border-2 transition-colors ${resolvedTheme === 'dark' ? 'border-gray-600 bg-gray-700 text-white focus:border-orange-500 focus:ring-orange-200' : 'border-gray-200 focus:border-orange-500 focus:ring-orange-200'}`}
                    placeholder="Enter your city"
                  />
                </div>
                <div className="space-y-2">
                  <label className={`block text-sm font-semibold ${resolvedTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    Pincode
                  </label>
                  <Input
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className={`border-2 transition-colors ${resolvedTheme === 'dark' ? 'border-gray-600 bg-gray-700 text-white focus:border-orange-500 focus:ring-orange-200' : 'border-gray-200 focus:border-orange-500 focus:ring-orange-200'}`}
                    placeholder="Enter pincode (optional)"
                  />
                </div>
              </div>
              
              {/* Place Order Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-6 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing Order...
                    </div>
                  ) : (
                    'Place Order'
                  )}
                </Button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Click to submit your order and proceed to payment
                </p>
              </div>
            </form>
          </div>

          {/* Enhanced Order Summary */}
          <div className="space-y-6">
            <div className={`rounded-2xl shadow-lg p-6 ${resolvedTheme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
              <div className="flex items-center mb-6">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${resolvedTheme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'}`}>
                  <CreditCard className={`h-5 w-5 ${resolvedTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <h2 className={`text-2xl font-bold ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Order Summary</h2>
              </div>
              
              <div className="space-y-3 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className={`flex justify-between items-center p-3 rounded-lg ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="flex-1">
                      <span className={`font-medium ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{item.name_en}</span>
                      <span className={`ml-2 ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>× {item.quantity}</span>
                    </div>
                    <span className={`font-semibold ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-800'}`}>₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className={`border-t-2 pt-4 ${resolvedTheme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}>
                  <div className="flex justify-between items-center">
                    <span className={`text-xl font-bold ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Total Amount</span>
                    <span className="text-2xl font-bold text-orange-600">₹{getTotalPrice()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Enhanced Payment Section */}
            <div className={`rounded-2xl shadow-lg p-6 ${resolvedTheme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
              <div className="flex items-center mb-6">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${resolvedTheme === 'dark' ? 'bg-green-900' : 'bg-green-100'}`}>
                  <CreditCard className={`h-5 w-5 ${resolvedTheme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                </div>
                <h3 className={`text-2xl font-bold ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Payment Options</h3>
              </div>
              
              <div className="space-y-6">
                {/* First QR Code */}
                <div className={`text-center p-4 rounded-xl ${resolvedTheme === 'dark' ? 'bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-700' : 'bg-gradient-to-r from-blue-50 to-indigo-50'}`}>
                  <p className={`text-sm font-semibold mb-3 ${resolvedTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>UPI Payment</p>
                  <div 
                    className="cursor-pointer transform transition-transform hover:scale-105"
                    onClick={() => openQRModal('/qrcode1.jpg', 'UPI Payment')}
                  >
                    <img
                      src="/qrcode1.jpg"
                      alt="UPI Payment QR"
                      className={`w-48 h-48 mx-auto rounded-xl border-2 object-contain shadow-lg ${resolvedTheme === 'dark' ? 'border-blue-600' : 'border-blue-200'}`}
                    />
                  </div>
                  <p className={`text-xs mt-2 ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Click to enlarge</p>
                </div>
                
                {/* Second QR Code */}
                <div className={`text-center p-4 rounded-xl ${resolvedTheme === 'dark' ? 'bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-700' : 'bg-gradient-to-r from-green-50 to-emerald-50'}`}>
                  <p className={`text-sm font-semibold mb-3 ${resolvedTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Alternative Payment</p>
                  <div 
                    className="cursor-pointer transform transition-transform hover:scale-105"
                    onClick={() => openQRModal('/qrcode2.jpg', 'Alternative Payment')}
                  >
                    <img
                      src="/qrcode2.jpg"
                      alt="Alternative Payment QR"
                      className={`w-48 h-48 mx-auto rounded-xl border-2 object-contain shadow-lg ${resolvedTheme === 'dark' ? 'border-green-600' : 'border-green-200'}`}
                    />
                  </div>
                  <p className={`text-xs mt-2 ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Click to enlarge</p>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <Button asChild variant="outline" className={`w-full border-2 ${resolvedTheme === 'dark' ? 'border-orange-600 text-orange-400 hover:bg-orange-900/20' : 'border-orange-200 text-orange-600 hover:bg-orange-50'}`}>
                  <Link to="/payment-upload">Upload Payment Screenshot</Link>
                </Button>
                <p className={`text-xs mt-3 ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  After payment, upload the screenshot to verify your order
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {selectedQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl shadow-2xl max-w-md w-full p-6 relative ${resolvedTheme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
            {/* Close Button */}
            <button
              onClick={closeQRModal}
              className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${resolvedTheme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              <X className={`h-5 w-5 ${resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
            </button>
            
            {/* Modal Content */}
            <div className="text-center">
              <h3 className={`text-xl font-bold mb-4 ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{selectedQR.title}</h3>
              <div className={`rounded-xl p-4 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <img
                  src={selectedQR.src}
                  alt={selectedQR.title}
                  className="w-full max-w-sm mx-auto rounded-lg shadow-lg"
                />
              </div>
              <p className={`text-sm mt-4 ${resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Scan this QR code with your payment app to complete the transaction
              </p>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default Checkout;
