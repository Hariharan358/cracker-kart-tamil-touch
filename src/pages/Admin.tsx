import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
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

// Types
interface ProductForm {
  name_en: string;
  name_ta: string;
  price: string;
  category: string;
  image: File | null;
}

interface Order {
  id: string;
  customer: string;
  mobile: string;
  status: string;
  total: number;
}

const Admin = () => {
  const { getTotalItems } = useCart();
  const { t } = useLanguage();
  const { toast } = useToast();

  const [productForm, setProductForm] = useState<ProductForm>({
    name_en: "",
    name_ta: "",
    price: "",
    category: "",
    image: null,
  });

  const [orders] = useState<Order[]>([
    { id: "ORD001", customer: "Raj Kumar", mobile: "9876543210", status: "confirmed", total: 1500 },
    { id: "ORD002", customer: "Priya S", mobile: "9876543211", status: "packed", total: 2300 },
    { id: "ORD003", customer: "Arun M", mobile: "9876543212", status: "shipped", total: 850 },
  ]);

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name_en", productForm.name_en);
    formData.append("name_ta", productForm.name_ta);
    formData.append("price", productForm.price);
    formData.append("category", productForm.category);
    if (productForm.image) {
      formData.append("image", productForm.image);
    }

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
      } else {
        toast({
          title: "❌ Failed to Add",
          description: data.error || "Something went wrong.",
        });
      }
    } catch (err: any) {
      toast({
        title: "❌ Server Error",
        description: err.message,
      });
    }
  };

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    toast({
      title: "Status Updated",
      description: `Order ${orderId} marked as ${newStatus}.`,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProductForm(prev => ({ ...prev, image: file }));
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
          <p className="text-lg text-muted-foreground">Manage products and orders efficiently</p>
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

          {/* Product Upload Tab */}
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
                        onChange={(e) => setProductForm(prev => ({ ...prev, name_en: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="name_ta">Product Name (Tamil)</Label>
                      <Input
                        id="name_ta"
                        value={productForm.name_ta}
                        onChange={(e) => setProductForm(prev => ({ ...prev, name_ta: e.target.value }))}
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
                        onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={productForm.category}
                        onValueChange={(value) => setProductForm(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="image">{t("image") || "Image"}</Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </div>

                  <Button type="submit" className="w-full">Save Product</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Order Management Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>{t("orderManagement")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div>
                        <p className="font-bold">{order.id}</p>
                        <p className="text-sm text-muted-foreground">{order.customer}</p>
                        <p className="text-sm text-muted-foreground">{order.mobile}</p>
                        <p className="text-primary font-medium">₹{order.total}</p>
                      </div>
                      <Select
                        defaultValue={order.status}
                        onValueChange={(val) => handleStatusUpdate(order.id, val)}
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

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader><CardTitle>Total Orders</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">127</p>
                  <p className="text-muted-foreground text-sm">This month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Revenue</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">₹1,24,500</p>
                  <p className="text-muted-foreground text-sm">This month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Active Products</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">89</p>
                  <p className="text-muted-foreground text-sm">Total</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default Admin;
