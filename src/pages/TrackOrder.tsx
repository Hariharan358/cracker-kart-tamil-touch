import { useState } from "react";
import { Search, Package, Truck, CheckCircle, Clock } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

const TrackOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [mobile, setMobile] = useState("");
  const [orderStatus, setOrderStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleTrackOrder = async () => {
    if (!orderId.trim() || !mobile.trim()) {
      alert("Please enter both Order ID and Mobile Number");
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`https://km-crackers.onrender.com/api/orders/track?orderId=${encodeURIComponent(orderId)}&mobile=${encodeURIComponent(mobile)}`);
      const data = await response.json();
      setOrderStatus(data);
    } catch (error) {
      setOrderStatus({ error: "Order not found or mobile number does not match" });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case "processing":
        return <Package className="h-6 w-6 text-blue-500" />;
      case "shipped":
        return <Truck className="h-6 w-6 text-orange-500" />;
      case "delivered":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      default:
        return <Clock className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={0} />
      
      <div className="w-full px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Track Your Order</h1>
            <p className="text-muted-foreground">Enter your order ID to track your order status</p>
          </div>

          <div className="bg-card p-6 rounded-lg border mb-8">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  placeholder="Enter Order ID"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleTrackOrder()}
                />
                <Input
                  placeholder="Enter Mobile Number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleTrackOrder()}
                />
              </div>
              <Button onClick={handleTrackOrder} disabled={loading} className="w-full">
                <Search className="h-4 w-4 mr-2" />
                {loading ? "Searching..." : "Track Order"}
              </Button>
            </div>
          </div>

          {loading && (
            <div className="text-center py-8">
              <p>Searching for your order...</p>
            </div>
          )}

          {orderStatus && !loading && (
            <div className="bg-card p-6 rounded-lg border">
              {orderStatus.error ? (
                <div className="text-center">
                  <p className="text-red-500">{orderStatus.error}</p>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Order Details</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="font-medium">Order ID:</span>
                      <span>{orderStatus.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Customer Name:</span>
                      <span>{orderStatus.customerDetails?.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Mobile Number:</span>
                      <span>{orderStatus.customerDetails?.mobile}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Status:</span>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(orderStatus.status)}
                        <span className="capitalize">{orderStatus.status}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Total:</span>
                      <span>₹{orderStatus.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Order Date:</span>
                      <span>{new Date(orderStatus.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TrackOrder;
