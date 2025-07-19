import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle, Package, Truck, MapPin, XCircle } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useCart } from "../hooks/useCart";
import { useLanguage } from "../contexts/LanguageContext";
import { useToast } from "../hooks/use-toast";

interface OrderStatus {
  status: "confirmed" | "packed" | "shipped" | "delivered";
  timestamp: string;
}

interface OrderDetails {
  orderId: string;
  items: any[];
  total: number;
  customerDetails: any;
  status: string;
  createdAt: string;
}

const orderStatuses: OrderStatus[] = [
  { status: "confirmed", timestamp: "Order confirmed" },
  { status: "packed", timestamp: "Order packed" },
  { status: "shipped", timestamp: "Order shipped" },
  { status: "delivered", timestamp: "Order delivered" },
];

const TrackOrder = () => {
  const { getTotalItems } = useCart();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  
  const [orderId, setOrderId] = useState(searchParams.get("orderId") || "");
  const [mobile, setMobile] = useState(searchParams.get("mobile") || "");
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTrackOrder = async () => {
    if (!orderId || !mobile) {
      toast({
        title: "Please fill all fields",
        description: "Order ID and mobile number are required.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/orders/track?orderId=${orderId}&mobile=${mobile}`);
      if (!response.ok) {
        throw new Error("Order not found");
      }
      const data = await response.json();
      setOrderDetails(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to track order.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const cancelOrder = async () => {
    if (!orderId) return;
    try {
      const res = await fetch(`http://localhost:5000/api/orders/cancel/${orderId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        toast({
          title: "Order Cancelled",
          description: `Order ${orderId} has been successfully cancelled.`,
        });
        setOrderDetails(null);
        setOrderId("");
        setMobile("");
      } else {
        throw new Error(data.error || "Failed to cancel order");
      }
    } catch (error: any) {
      toast({
        title: "Cancellation Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (orderId && mobile) {
      handleTrackOrder();
    }
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed": return <CheckCircle className="h-5 w-5" />;
      case "packed": return <Package className="h-5 w-5" />;
      case "shipped": return <Truck className="h-5 w-5" />;
      case "delivered": return <MapPin className="h-5 w-5" />;
      default: return <CheckCircle className="h-5 w-5" />;
    }
  };

  const getCurrentStatusIndex = (currentStatus: string) => {
    return orderStatuses.findIndex(status => status.status === currentStatus);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={getTotalItems()} />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">
          <span className="bg-gradient-primary bg-clip-text text-transparent">Track Your Order</span>
        </h1>

        {/* Search Form */}
        <div className="max-w-md mx-auto mb-8 bg-gradient-card rounded-lg p-6 shadow-card border border-border">
          <div className="space-y-4">
            <div>
              <Label htmlFor="orderId">Order ID</Label>
              <Input id="orderId" type="text" value={orderId} onChange={(e) => setOrderId(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input id="mobile" type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} />
            </div>
            <Button variant="festive" className="w-full" onClick={handleTrackOrder} disabled={isLoading}>
              {isLoading ? "Tracking..." : "Track Order"}
            </Button>
          </div>
        </div>

        {/* Order Info */}
        {orderDetails && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-gradient-card rounded-lg p-6 shadow-card border border-border">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Order Information</h2>
                {orderDetails.status !== "delivered" && (
                  <Button variant="destructive" size="sm" onClick={cancelOrder}>
                    <XCircle className="w-4 h-4 mr-1" />
                    Cancel Order
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div><p className="text-sm text-muted-foreground">Order ID</p><p className="font-semibold">{orderDetails.orderId}</p></div>
                <div><p className="text-sm text-muted-foreground">Order Date</p><p className="font-semibold">{new Date(orderDetails.createdAt).toLocaleDateString()}</p></div>
                <div><p className="text-sm text-muted-foreground">Total Amount</p><p className="font-semibold text-primary">₹{orderDetails.total}</p></div>
                <div><p className="text-sm text-muted-foreground">Payment</p><p className="font-semibold">Cash on Delivery</p></div>
              </div>
            </div>

            {/* Status Steps */}
            <div className="bg-gradient-card rounded-lg p-6 shadow-card border border-border">
              <h2 className="text-xl font-semibold mb-6">Order Status</h2>
              <div className="space-y-4">
                {orderStatuses.map((status, index) => {
                  const isCompleted = index <= getCurrentStatusIndex(orderDetails.status);
                  const isCurrent = index === getCurrentStatusIndex(orderDetails.status);
                  return (
                    <div key={status.status} className="flex items-center space-x-4">
                      <div className={`w-10 h-10 flex items-center justify-center rounded-full ${isCompleted ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'} ${isCurrent ? 'animate-pulse' : ''}`}>
                        {getStatusIcon(status.status)}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>{status.timestamp}</p>
                        {isCurrent && <p className="text-sm text-primary">Current Status</p>}
                      </div>
                      {isCompleted && <CheckCircle className="w-5 h-5 text-green-500" />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Items */}
            <div className="bg-gradient-card rounded-lg p-6 shadow-card border border-border">
              <h2 className="text-xl font-semibold mb-4">Order Items</h2>
              <div className="space-y-3">
                {orderDetails.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{item.name_en}</p>
                      <p className="text-sm text-muted-foreground">{item.name_ta}</p>
                      <p className="text-sm">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-semibold">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default TrackOrder;
