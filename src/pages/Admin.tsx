import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useCart } from "../hooks/useCart";
import { useLanguage } from "../contexts/LanguageContext";
import { useToast } from "../hooks/use-toast";
import { categories } from "../data/mockData";
import { ShieldCheck, Package, TrendingUp } from "lucide-react";

const Admin = () => {
  const { getTotalItems } = useCart();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [productForm, setProductForm] = useState({
    name_en: '',
    name_ta: '',
    price: '',
    category: '',
    image: null as File | null
  });

  const [orders] = useState([
    { id: 'ORD001', customer: 'Raj Kumar', mobile: '9876543210', status: 'confirmed', total: 1500 },
    { id: 'ORD002', customer: 'Priya S', mobile: '9876543211', status: 'packed', total: 2300 },
    { id: 'ORD003', customer: 'Arun M', mobile: '9876543212', status: 'shipped', total: 850 },
  ]);

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically submit to your backend
    toast({
      title: "Product Added!",
      description: `${productForm.name_en} has been added successfully.`,
    });
    setProductForm({ name_en: '', name_ta: '', price: '', category: '', image: null });
  };

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    // Here you would typically update the backend
    toast({
      title: "Status Updated!",
      description: `Order ${orderId} status updated to ${newStatus}.`,
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
          <div className="flex items-center justify-center mb-4">
            <ShieldCheck className="h-8 w-8 text-primary animate-sparkle mr-2" />
            <h1 className="text-4xl font-bold">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                {t('adminPanel')}
              </span>
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Manage products and orders efficiently
          </p>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              {t('addProduct')}
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              {t('orderManagement')}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>{t('addProduct')}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProductSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name_en">Product Name (English)</Label>
                      <Input
                        id="name_en"
                        value={productForm.name_en}
                        onChange={(e) => setProductForm(prev => ({ ...prev, name_en: e.target.value }))}
                        placeholder="Enter product name in English"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="name_ta">Product Name (Tamil)</Label>
                      <Input
                        id="name_ta"
                        value={productForm.name_ta}
                        onChange={(e) => setProductForm(prev => ({ ...prev, name_ta: e.target.value }))}
                        placeholder="தயாரிப்பு பெயரை தமிழில் உள்ளிடவும்"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">{t('price')} (₹)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={productForm.price}
                        onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="Enter price"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category">{t('category')}</Label>
                      <Select
                        value={productForm.category}
                        onValueChange={(value) => setProductForm(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">{t('image')}</Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="cursor-pointer"
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    {t('saveProduct')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>{t('orderManagement')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="space-y-1">
                        <p className="font-semibold">{order.id}</p>
                        <p className="text-sm text-muted-foreground">{order.customer}</p>
                        <p className="text-sm text-muted-foreground">{order.mobile}</p>
                        <p className="font-medium">₹{order.total}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Select
                          defaultValue={order.status}
                          onValueChange={(value) => handleStatusUpdate(order.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="confirmed">{t('confirmed')}</SelectItem>
                            <SelectItem value="packed">{t('packed')}</SelectItem>
                            <SelectItem value="shipped">{t('shipped')}</SelectItem>
                            <SelectItem value="delivered">{t('delivered')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">127</p>
                  <p className="text-sm text-muted-foreground">This month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">₹1,24,500</p>
                  <p className="text-sm text-muted-foreground">This month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Active Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">89</p>
                  <p className="text-sm text-muted-foreground">Total products</p>
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