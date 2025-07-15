import { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

import { useNavigate } from "react-router-dom";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { useCart } from "../hooks/useCart";
import { useLanguage } from "../contexts/LanguageContext";
import { useToast } from "../hooks/use-toast";
import { categories } from "../data/mockData";
import { ShieldCheck, Package, TrendingUp } from "lucide-react";

const Admin = () => {
  const { getTotalItems } = useCart();
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token !== "admin-auth-token") {
      navigate("/admin-login"); // unauthorized? redirect
    }
  }, []);

  const [productForm, setProductForm] = useState({
    name_en: "",
    name_ta: "",
    price: "",
    category: "",
    image: null,
  });

  const [orders, setOrders] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const [searchOrderId, setSearchOrderId] = useState("");

  const [analytics, setAnalytics] = useState({
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  const fetchOrders = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (searchDate.trim()) queryParams.append("date", searchDate);
      if (searchOrderId.trim()) queryParams.append("orderId", searchOrderId);

      const res = await fetch(`http://localhost:5000/api/orders?${queryParams.toString()}`);
      const data = await res.json();

      if (res.ok) {
        setOrders(data);
      } else {
        toast({
          title: "❌ Failed to fetch orders",
          description: data.error || "Server error",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "❌ Network error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/analytics");
      const data = await res.json();
      if (res.ok) setAnalytics(data);
    } catch (error) {
      console.error("Analytics fetch error:", error);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  useEffect(() => {
    const delayFetch = setTimeout(() => {
      fetchOrders();
    }, 300);
    return () => clearTimeout(delayFetch);
  }, [searchDate, searchOrderId]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name_en", productForm.name_en);
    formData.append("name_ta", productForm.name_ta);
    formData.append("price", productForm.price);
    formData.append("category", productForm.category);
    if (productForm.image) formData.append("image", productForm.image);

    try {
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        toast({
          title: "✅ Product Added!",
          description: `${productForm.name_en} added successfully.`,
        });
        setProductForm({ name_en: "", name_ta: "", price: "", category: "", image: null });
        fetchAnalytics();
      } else {
        toast({
          title: "❌ Failed to Add",
          description: data.error || "Something went wrong.",
        });
      }
    } catch (err) {
      toast({ title: "❌ Server Error", description: err.message });
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/update-status/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({
          title: "✅ Status Updated",
          description: `Order ${orderId} marked as ${newStatus}.`,
        });
        fetchOrders();
      } else {
        toast({
          title: "❌ Update Failed",
          description: data.error || "Unknown error",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "❌ Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProductForm((prev) => ({ ...prev, image: file }));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={getTotalItems()} />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <ShieldCheck className="h-8 w-8 text-primary animate-sparkle mr-2" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text">
              {t("adminPanel")}
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Manage products and orders efficiently
          </p>
        </div>

        <Tabs defaultValue="products">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="products">
              <Package className="h-4 w-4 mr-2" />
              {t("addProduct")}
            </TabsTrigger>
            <TabsTrigger value="orders">
              <TrendingUp className="h-4 w-4 mr-2" />
              {t("orderManagement")}
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <TrendingUp className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* PRODUCT FORM */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>{t("addProduct")}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProductSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name_en">Product Name (English)</Label>
                      <Input
                        id="name_en"
                        value={productForm.name_en}
                        onChange={(e) =>
                          setProductForm((prev) => ({ ...prev, name_en: e.target.value }))
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="name_ta">Product Name (Tamil)</Label>
                      <Input
                        id="name_ta"
                        value={productForm.name_ta}
                        onChange={(e) =>
                          setProductForm((prev) => ({ ...prev, name_ta: e.target.value }))
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Price (₹)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={productForm.price}
                        onChange={(e) =>
                          setProductForm((prev) => ({ ...prev, price: e.target.value }))
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={productForm.category}
                        onValueChange={(value) =>
                          setProductForm((prev) => ({ ...prev, category: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="image">Image</Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Save Product
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ORDER MANAGEMENT */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>{t("orderManagement")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div>
                    <Label>Search by Date</Label>
                    <Input
                      type="date"
                      value={searchDate}
                      onChange={(e) => setSearchDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Search by Order ID</Label>
                    <Input
                      type="text"
                      placeholder="Enter Order ID"
                      value={searchOrderId}
                      onChange={(e) => setSearchOrderId(e.target.value)}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      className="mr-2 bg-primary hover:bg-primary/50"
                      onClick={fetchOrders}
                    >
                      Apply Filter
                    </Button>
                    <Button
                      className="ml-2"
                      variant="outline"
                      onClick={() => {
                        setSearchDate("");
                        setSearchOrderId("");
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.orderId}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div>
                        <p className="font-bold">{order.orderId}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.customerDetails.fullName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {order.customerDetails.mobile}
                        </p>
                        <p className="text-primary font-medium">₹{order.total}</p>
                      </div>
                      <Select
                        defaultValue={order.status}
                        onValueChange={(val) =>
                          handleStatusUpdate(order.orderId, val)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="packed">Packed</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ANALYTICS */}
          <TabsContent value="analytics">
            {loadingAnalytics ? (
              <p className="text-center text-muted-foreground">Loading analytics...</p>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Total Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-primary">
                      {analytics.totalOrders}
                    </p>
                    <p className="text-muted-foreground text-sm">All time</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Total Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-primary">
                      ₹{(analytics.totalRevenue || 0).toLocaleString()}
                    </p>
                    <p className="text-muted-foreground text-sm">All time</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Active Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-primary">--</p>
                    <p className="text-muted-foreground text-sm">Coming soon</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default Admin;
