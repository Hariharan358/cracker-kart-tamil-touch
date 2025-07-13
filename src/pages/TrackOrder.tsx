import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle, Package, Truck, MapPin } from "lucide-react";
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

  const handleTrackOrder = () => {
    if (!orderId || !mobile) {
      toast({
        title: "Please fill all fields",
        description: "Order ID and mobile number are required.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const storedOrder = localStorage.getItem(`order_${orderId}`);
      
      if (storedOrder) {
        const order = JSON.parse(storedOrder);
        if (order.customerDetails.mobile === mobile) {
          setOrderDetails(order);
        } else {
          toast({
            title: "Order not found",
            description: "Please check your order ID and mobile number.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Order not found",
          description: "Please check your order ID and mobile number.",
          variant: "destructive",
        });
      }
      
      setIsLoading(false);
    }, 1000);
  };

  // Auto-track if URL params are present
  useEffect(() => {
    if (orderId && mobile) {
      handleTrackOrder();
    }
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-5 w-5" />;
      case "packed":
        return <Package className="h-5 w-5" />;
      case "shipped":
        return <Truck className="h-5 w-5" />;
      case "delivered":
        return <MapPin className="h-5 w-5" />;
      default:
        return <CheckCircle className="h-5 w-5" />;
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

        {/* Track Order Form */}
        <div className="max-w-md mx-auto mb-8 bg-gradient-card rounded-lg p-6 shadow-card border border-border">
          <div className="space-y-4">
            <div>
              <Label htmlFor="orderId">Order ID</Label>
              <Input
                id="orderId"
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter your order ID"
              />
            </div>
            
            <div>
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter your mobile number"
              />
            </div>
            
            <Button
              variant="festive"
              className="w-full"
              onClick={handleTrackOrder}
              disabled={isLoading}
            >
              {isLoading ? "Tracking..." : "Track Order"}
            </Button>
          </div>
        </div>

        {/* Order Details */}
        {orderDetails && (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Order Info */}
            <div className="bg-gradient-card rounded-lg p-6 shadow-card border border-border">
              <h2 className="text-xl font-semibold mb-4">Order Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <p className="font-semibold">{orderDetails.orderId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p className="font-semibold">
                    {new Date(orderDetails.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="font-semibold text-primary">₹{orderDetails.total}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <p className="font-semibold">Cash on Delivery</p>
                </div>
              </div>
            </div>

            {/* Order Status */}
            <div className="bg-gradient-card rounded-lg p-6 shadow-card border border-border">
              <h2 className="text-xl font-semibold mb-6">Order Status</h2>
              
              <div className="space-y-4">
                {orderStatuses.map((status, index) => {
                  const isCompleted = index <= getCurrentStatusIndex(orderDetails.status);
                  const isCurrent = index === getCurrentStatusIndex(orderDetails.status);
                  
                  return (
                    <div key={status.status} className="flex items-center space-x-4">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        isCompleted 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      } ${isCurrent ? 'animate-pulse' : ''}`}>
                        {getStatusIcon(status.status)}
                      </div>
                      
                      <div className="flex-1">
                        <p className={`font-medium ${
                          isCompleted ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {status.timestamp}
                        </p>
                        {isCurrent && (
                          <p className="text-sm text-primary">Current Status</p>
                        )}
                      </div>
                      
                      {isCompleted && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-gradient-card rounded-lg p-6 shadow-card border border-border">
              <h2 className="text-xl font-semibold mb-4">Order Items</h2>
              <div className="space-y-3">
                {orderDetails.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{item.name_en}</p>
                      <p className="text-sm text-muted-foreground">{item.name_ta}</p>
                      <p className="text-sm">Quantity: {item.quantity}</p>
                    </div>
                    <span className="font-semibold">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;