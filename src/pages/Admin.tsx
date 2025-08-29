import { useState, useEffect, useRef } from "react";
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
import { useFCM } from "../hooks/useFCM";
import { ShieldCheck, Package, TrendingUp, Eye, CheckCircle, XCircle, FolderPlus, FolderOpen } from "lucide-react";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";

const Admin = () => {
  const { getTotalItems } = useCart();
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { requestPermission } = useFCM();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token !== "admin-auth-token") {
      navigate("/admin-login"); // unauthorized? redirect
    } else {
      // Register admin for notifications
      requestPermission();
    }
  }, [requestPermission]);

  const [productForm, setProductForm] = useState({
    name_en: "",
    name_ta: "",
    price: "",
    original_price: "",
    category: "",
    image: null,
    imageUrl: "",
    youtube_url: "",
  });

  const [orders, setOrders] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const [searchOrderId, setSearchOrderId] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const orderStatuses = [
    { value: 'all', label: 'All' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'payment_verified', label: 'Payment Verified' },
    { value: 'booked', label: 'Booked' },
  ];
  const paymentFilters = [
    { value: 'all', label: 'All Orders' },
    { value: 'with_payment', label: 'With Payment' },
    { value: 'pending_verification', label: 'Pending Verification' },
    { value: 'verified', label: 'Verified' },
  ];

  const [analytics, setAnalytics] = useState({
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [productManagementCategory, setProductManagementCategory] = useState("");
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [loadingCategoryProducts, setLoadingCategoryProducts] = useState(false);
  const [categoryProductCounts, setCategoryProductCounts] = useState({});
  const [loadingCategoryCounts, setLoadingCategoryCounts] = useState(false);
  const [analyticsDate, setAnalyticsDate] = useState("");
  const [analyticsDayStats, setAnalyticsDayStats] = useState({ totalOrders: 0, totalRevenue: 0 });
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name_en: "",
    name_ta: "",
    price: "",
    original_price: "",
    category: "",
    image: null,
    imageUrl: "",
    youtube_url: "",
  });
  const fileInputRef = useRef(null);
  const [discount, setDiscount] = useState("");
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [notificationForm, setNotificationForm] = useState({
    title: "",
    body: "",
  });
  const [isSendingNotification, setIsSendingNotification] = useState(false);
  const [paymentViewOrder, setPaymentViewOrder] = useState(null);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);

  // Category management state
  const [categories, setCategories] = useState([]);
  const [newCategoryEn, setNewCategoryEn] = useState("");
  const [newCategoryTa, setNewCategoryTa] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isDeletingCategory, setIsDeletingCategory] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editCategoryForm, setEditCategoryForm] = useState({
    displayName_en: "",
    displayName_ta: "",
    iconUrl: "",
  });

  // Add state for transportName and lrNumber per order
  const [transportInputs, setTransportInputs] = useState({});

  const handleTransportInputChange = (orderId, field, value) => {
    setTransportInputs((prev) => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        [field]: value,
      },
    }));
  };

  const handleTransportSubmit = async (orderId) => {
    const { transportName = '', lrNumber = '' } = transportInputs[orderId] || {};
    if (!transportName || !lrNumber) {
      toast({ title: 'Both fields required', description: 'Please enter both Transport Name and LR Number.', variant: 'destructive' });
      return;
    }
    try {
      const res = await fetch(`https://api.kmpyrotech.com/api/orders/update-status/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transportName, lrNumber }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: 'Transport details updated', description: 'Order marked as booked.' });
        fetchOrders();
        setTransportInputs((prev) => ({ ...prev, [orderId]: { transportName: '', lrNumber: '' } }));
      } else {
        toast({ title: 'Update failed', description: data.error || 'Unknown error', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  // Category management functions
  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      // Add cache-busting parameter to ensure fresh data
      const timestamp = Date.now();
      const res = await fetch(`https://api.kmpyrotech.com/api/categories/public?t=${timestamp}`);
      if (!res.ok) {
        const errorMessage = await getErrorMessage(res);
        toast({
          title: "❌ Failed to fetch categories",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }
      const data = await res.json();
      setCategories(Array.isArray(data) ? data.map(cat => ({
        ...cat,
        displayName_en: cat.displayName_en || cat.displayName || cat.name,
        displayName_ta: cat.displayName_ta || ''
      })) : []);
    } catch (error) {
      toast({
        title: "❌ Network error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchDetailedCategories = async () => {
    try {
      // Add cache-busting parameter to ensure fresh data
      const timestamp = Date.now();
      const res = await fetch(`https://api.kmpyrotech.com/api/categories/detailed?t=${timestamp}`);
      if (!res.ok) {
        return;
      }
      const data = await res.json();
      const counts = {};
      data.forEach(cat => {
        counts[cat.name] = cat.displayName || cat.name;
      });
      setCategoryProductCounts(counts);
    } catch (error) {
      console.error('Error fetching detailed categories:', error);
    }
  };

  const getErrorMessage = async (res) => {
    let errorMessage = 'Unknown error';
    const contentType = res.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      try {
        const data = await res.json();
        errorMessage = data.error || 'Server error';
      } catch {
        errorMessage = 'Invalid JSON response';
      }
    } else {
      errorMessage = await res.text();
      errorMessage = errorMessage.substring(0, 200); // truncate long HTML
    }
    return errorMessage;
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryEn.trim()) {
      toast({
        title: "❌ English name required",
        description: "Please enter an English category name",
        variant: "destructive",
      });
      return;
    }

    setIsAddingCategory(true);
    try {
      const name = newCategoryEn.trim().toUpperCase().replace(/\s+/g, '_');
      const res = await fetch('https://api.kmpyrotech.com/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name,
          displayName_en: newCategoryEn.trim(),
          displayName_ta: newCategoryTa.trim()
        }),
      });
      if (!res.ok) {
        const errorMessage = await getErrorMessage(res);
        toast({
          title: "❌ Failed to Add Category",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }
      const data = await res.json();
      toast({
        title: "✅ Category Added!",
        description: `${data.category} added successfully.`,
      });
      setNewCategoryEn("");
      setNewCategoryTa("");
      fetchCategories();
      fetchDetailedCategories();
    } catch (error) {
      toast({
        title: "❌ Server Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsAddingCategory(false);
    }
  };

  const handleDeleteCategory = async (categoryName) => {
    if (!window.confirm(`Are you sure you want to delete the category "${categoryName}"? This action cannot be undone.`)) {
      return;
    }

    setIsDeletingCategory(true);
    try {
      const res = await fetch(`https://api.kmpyrotech.com/api/categories/${encodeURIComponent(categoryName)}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errorMessage = await getErrorMessage(res);
        toast({
          title: "❌ Failed to Delete Category",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }
      const data = await res.json();
      toast({
        title: "✅ Category Deleted!",
        description: `${categoryName} removed successfully.`,
      });
      fetchCategories();
      fetchDetailedCategories();
      
      // If the deleted category was selected in product management, clear it
      if (productManagementCategory === categoryName) {
        setProductManagementCategory("");
        setCategoryProducts([]);
      }
    } catch (error) {
      toast({
        title: "❌ Server Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeletingCategory(false);
    }
  };

  const handleEditCategoryClick = (category) => {
    setEditCategoryForm({
      displayName_en: category.displayName_en || category.displayName || category.name,
      displayName_ta: category.displayName_ta || "",
      iconUrl: category.iconUrl || "",
    });
    setEditingCategory(category);
    setIsEditingCategory(true);
  };

  const handleEditCategorySubmit = async (e) => {
    e.preventDefault();
    const { displayName_en, displayName_ta, iconUrl } = editCategoryForm;
    if (!displayName_en.trim()) {
      toast({ title: 'Invalid name', description: 'English display name cannot be empty', variant: 'destructive' });
      return;
    }
    try {
      const res = await fetch(`https://api.kmpyrotech.com/api/categories/${encodeURIComponent(editingCategory.name)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName_en: displayName_en.trim(), displayName_ta: displayName_ta.trim(), iconUrl: iconUrl.trim() })
      });
      if (!res.ok) {
        const errorMessage = await getErrorMessage(res);
        toast({ title: '❌ Update failed', description: errorMessage, variant: 'destructive' });
        return;
      }
      const data = await res.json();
      toast({ title: '✅ Category updated', description: `${editingCategory.name} display names changed.` });
      
      // Force refresh categories with a small delay to ensure backend cache is cleared
      setTimeout(() => {
        fetchCategories();
        fetchDetailedCategories();
      }, 500);
      
      setIsEditingCategory(false);
    } catch (error) {
      toast({ title: '❌ Network error', description: error.message, variant: 'destructive' });
    }
  };

  const handleEditCategoryFormChange = (field, value) => {
    setEditCategoryForm((prev) => ({ ...prev, [field]: value }));
  };

  const fetchOrders = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (searchDate.trim()) queryParams.append("date", searchDate);
      if (searchOrderId.trim()) queryParams.append("orderId", searchOrderId);

      const res = await fetch(`https://api.kmpyrotech.com/api/orders?${queryParams.toString()}`);
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

  const fetchAnalytics = async (date = "") => {
    try {
      let url = "https://api.kmpyrotech.com/api/analytics";
      if (date) url += `?date=${date}`;
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        if (date) setAnalyticsDayStats(data);
        else setAnalytics(data);
      }
    } catch (error) {
      console.error("Analytics fetch error:", error);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const fetchCategoryProducts = async (category) => {
    setLoadingCategoryProducts(true);
    try {
  const res = await fetch(`https://api.kmpyrotech.com/api/products/category/${encodeURIComponent(category)}`);
      const data = await res.json();
      setCategoryProducts(data);
    } catch (err) {
      setCategoryProducts([]);
    } finally {
      setLoadingCategoryProducts(false);
    }
  };

  const fetchCategoryProductCounts = async () => {
    setLoadingCategoryCounts(true);
    try {
      const counts = {};
      for (const cat of categories) {
        try {
          const res = await fetch(`https://api.kmpyrotech.com/api/products/category/${encodeURIComponent(cat.name)}`);
          const data = await res.json();
          counts[cat.name] = data.length;
        } catch (err) {
          counts[cat.name] = 0;
        }
      }
      setCategoryProductCounts(counts);
    } catch (err) {
      console.error('Error fetching category counts:', err);
    } finally {
      setLoadingCategoryCounts(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`https://api.kmpyrotech.com/api/products/${productId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCategoryProducts((prev) => prev.filter((p) => p._id !== productId && p.id !== productId));
        fetchCategoryProductCounts();
        toast({ title: "Product deleted" });
      } else {
        toast({ title: "Failed to delete product", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Server error", description: err.message, variant: "destructive" });
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
    fetchCategoryProductCounts();
    fetchCategories();
    fetchDetailedCategories();
  }, []);

  useEffect(() => {
    if (analyticsDate) {
      setLoadingAnalytics(true);
      fetchAnalytics(analyticsDate);
    }
  }, [analyticsDate]);

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    
    // Validate that at least one image option is provided
    if (!productForm.image && !productForm.imageUrl) {
      toast({
        title: "❌ Image Required",
        description: "Please upload an image file or provide an image URL.",
        variant: "destructive",
      });
      return;
    }
    
    const formData = new FormData();
    formData.append("name_en", productForm.name_en);
    formData.append("name_ta", productForm.name_ta);
    formData.append("price", productForm.price);
    if (productForm.original_price) formData.append("original_price", productForm.original_price);
    formData.append("category", productForm.category);
    if (productForm.image) formData.append("image", productForm.image);
    if (productForm.imageUrl) formData.append("imageUrl", productForm.imageUrl);
    if (productForm.youtube_url) formData.append("youtube_url", productForm.youtube_url);

    setIsAddingProduct(true);
    try {
  const res = await fetch("https://api.kmpyrotech.com/api/products", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        toast({
          title: "✅ Product Added!",
          description: `${productForm.name_en} added successfully.`,
        });
        setProductForm({ name_en: "", name_ta: "", price: "", original_price: "", category: "", image: null, imageUrl: "", youtube_url: "" });
        fetchAnalytics();
        fetchCategoryProductCounts();
      } else {
        toast({
          title: "❌ Failed to Add",
          description: data.error || "Something went wrong.",
        });
      }
    } catch (err) {
      toast({ title: "❌ Server Error", description: err.message });
    } finally {
      setIsAddingProduct(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const res = await fetch(`https://api.kmpyrotech.com/api/orders/update-status/${orderId}`, {
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

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete/cancel this order?")) return;
    try {
      const res = await fetch(`https://api.kmpyrotech.com/api/orders/cancel/${orderId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        toast({
          title: "Order deleted/cancelled",
          description: `Order ${orderId} has been deleted/cancelled successfully.`,
        });
        fetchOrders();
      } else {
        toast({
          title: "Failed to delete order",
          description: data.error || "Unknown error",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Server error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProductForm((prev) => ({ ...prev, image: file, imageUrl: "" }));
    }
  };

  const handleEditClick = (product) => {
    setEditProduct(product);
    setEditForm({
      name_en: product.name_en,
      name_ta: product.name_ta,
      price: product.price,
      original_price: product.original_price || "",
      category: product.category,
      image: null,
      imageUrl: product.imageUrl || product.image_url || "",
      youtube_url: product.youtube_url || "",
    });
    setIsEditing(true);
  };

  const handleEditFormChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditForm((prev) => ({ ...prev, image: file, imageUrl: "" }));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editProduct) return;
    
    // Validate that at least one image option is provided (unless keeping existing image)
    if (!editForm.image && !editForm.imageUrl && !(editProduct.imageUrl || editProduct.image_url)) {
      toast({
        title: "❌ Image Required",
        description: "Please upload an image file or provide an image URL.",
        variant: "destructive",
      });
      return;
    }
    
    const formData = new FormData();
    formData.append("name_en", editForm.name_en);
    formData.append("name_ta", editForm.name_ta);
    formData.append("price", editForm.price);
    if (editForm.original_price) formData.append("original_price", editForm.original_price);
    formData.append("category", editForm.category);
    if (editForm.image) formData.append("image", editForm.image);
    if (editForm.imageUrl) formData.append("imageUrl", editForm.imageUrl);
    if (editForm.youtube_url) formData.append("youtube_url", editForm.youtube_url);
    try {
      const res = await fetch(`https://api.kmpyrotech.com/api/products/${editProduct._id || editProduct.id}`, {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: "✅ Product Updated!", description: `${editForm.name_en} updated successfully.` });
        setIsEditing(false);
        setEditProduct(null);
        setEditForm({ name_en: "", name_ta: "", price: "", original_price: "", category: "", image: null, imageUrl: "", youtube_url: "" });
        if (productManagementCategory) fetchCategoryProducts(productManagementCategory);
        fetchCategoryProductCounts();
      } else {
        toast({ title: "❌ Failed to Update", description: data.error || "Something went wrong." });
      }
    } catch (err) {
      toast({ title: "❌ Server Error", description: err.message });
    }
  };

  const handleApplyDiscount = async (e) => {
    e.preventDefault();
    if (!discount || isNaN(Number(discount)) || Number(discount) < 0 || Number(discount) > 100) {
      toast({ title: "Invalid Discount", description: "Please enter a valid discount percentage (0-100).", variant: "destructive" });
      return;
    }
    setIsApplyingDiscount(true);
    try {
  const res = await fetch("https://api.kmpyrotech.com/api/products/apply-discount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discount: Number(discount) }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: "✅ Discount Applied!", description: `All products updated with ${discount}% discount.` });
        setDiscount("");
        if (productManagementCategory) fetchCategoryProducts(productManagementCategory);
        fetchCategoryProductCounts();
      } else {
        toast({ title: "❌ Failed to Apply Discount", description: data.error || "Something went wrong." });
      }
    } catch (err) {
      toast({ title: "❌ Server Error", description: err.message });
    } finally {
      setIsApplyingDiscount(false);
    }
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!notificationForm.title || !notificationForm.body) {
      toast({ title: "Invalid Notification", description: "Please enter both title and body.", variant: "destructive" });
      return;
    }
    setIsSendingNotification(true);
    try {
  const res = await fetch("https://api.kmpyrotech.com/api/notifications/send-to-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notificationForm),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: "✅ Notification Sent!", description: `Sent to ${data.successCount} users successfully.` });
        setNotificationForm({ title: "", body: "" });
      } else {
        toast({ title: "❌ Failed to Send Notification", description: data.error || "Something went wrong." });
      }
    } catch (err) {
      toast({ title: "❌ Server Error", description: err.message });
    } finally {
      setIsSendingNotification(false);
    }
  };

  const handleVerifyPayment = async (orderId, verified) => {
    setIsVerifyingPayment(true);
    try {
      const response = await fetch(`https://api.kmpyrotech.com/api/orders/verify-payment/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verified, verifiedBy: "admin" }),
      });
      const data = await response.json();
      if (response.ok) {
        toast({ 
          title: "✅ Success", 
          description: `Payment ${verified ? 'verified' : 'rejected'} successfully. Order status updated to ${verified ? 'payment_verified' : 'confirmed'}.` 
        });
        // Refresh orders to show updated status
        fetchOrders();
        setPaymentViewOrder(null);
      } else {
        toast({ title: "❌ Error", description: data.error });
      }
    } catch (err) {
      toast({ title: "❌ Server Error", description: err.message });
    } finally {
      setIsVerifyingPayment(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={getTotalItems()} />
      <div className="w-[98%] max-w-7xl mx-auto px-4 py-8">
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
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="products">
              <Package className="h-4 w-4 mr-2" />
              {t("addProduct")}
            </TabsTrigger>
            <TabsTrigger value="product-management">
              <Package className="h-4 w-4 mr-2" />
              Product Management
            </TabsTrigger>
            <TabsTrigger value="categories">
              <FolderOpen className="h-4 w-4 mr-2" />
              Categories
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

          {/* PRODUCT MANAGEMENT TAB */}
          <TabsContent value="product-management">
            <Card>
              <CardHeader>
                <CardTitle>Product Management</CardTitle>
              </CardHeader>
              <CardContent className="max-h-[70vh] overflow-y-auto">
                <div className="mb-4">
                  <Label htmlFor="pm-category">Select Category</Label>
                  <select
                    id="pm-category"
                    className="w-full border rounded-md p-2 mt-1 bg-background text-foreground"
                    value={productManagementCategory}
                    onChange={(e) => {
                      setProductManagementCategory(e.target.value);
                      if (e.target.value) fetchCategoryProducts(e.target.value);
                      else setCategoryProducts([]);
                    }}
                  >
                    <option value="">-- Select Category --</option>
                    {categories.map((cat) => (
                      <option key={cat.name} value={cat.name}>
                        {cat.displayName_en}{cat.displayName_ta ? ` (${cat.displayName_ta})` : ''} {loadingCategoryCounts ? '(Loading...)' : `(${categoryProductCounts[cat.name] || 0} products)`}
                      </option>
                    ))}
                  </select>
                </div>
                {loadingCategoryProducts ? (
                  <p className="text-muted-foreground">Loading products...</p>
                ) : categoryProducts.length === 0 && productManagementCategory ? (
                  <p className="text-muted-foreground">No products found in this category.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {categoryProducts.map((product) => (
                      <div key={product._id || product.id} className="bg-card rounded-lg shadow-card p-4 flex flex-col gap-2 border border-border">
                        <img src={product.imageUrl || product.image_url} alt={product.name_en} className="h-32 w-full object-cover rounded-md mb-2" />
                        <div className="font-semibold text-lg">{product.name_en}</div>
                        <div className="text-sm text-muted-foreground">{product.name_ta}</div>
                        <div className="text-primary font-bold">₹{product.price}</div>
                        <Button variant="secondary" size="sm" onClick={() => handleEditClick(product)}>
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteProduct(product._id || product.id)}>
                          Delete
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* CATEGORIES TAB */}
          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>Category Management</CardTitle>
              </CardHeader>
              <CardContent className="max-h-[70vh] overflow-y-auto">
                {/* Add New Category Form */}
                <div className="mb-6 p-4 border rounded-lg bg-muted/50">
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <FolderPlus className="h-5 w-5 mr-2" />
                    Add New Category
                  </h3>
                  <form onSubmit={handleAddCategory} className="space-y-3">
                    <Input
                      placeholder="Enter category English name (e.g., New Category)"
                      value={newCategoryEn}
                      onChange={(e) => setNewCategoryEn(e.target.value)}
                      disabled={isAddingCategory}
                    />
                    <Input
                      placeholder="Enter category Tamil name (optional)"
                      value={newCategoryTa}
                      onChange={(e) => setNewCategoryTa(e.target.value)}
                      disabled={isAddingCategory}
                    />
                    <Button 
                      type="submit" 
                      disabled={isAddingCategory || !newCategoryEn.trim()}
                      className="w-full"
                    >
                      {isAddingCategory ? (
                        <span className="flex items-center justify-center">
                          <Loader2 className="animate-spin h-4 w-4 mr-2" /> Adding...
                        </span>
                      ) : (
                        "Add Category"
                      )}
                    </Button>
                  </form>
                  <p className="text-xs text-muted-foreground mt-2">
                    Internal name will be generated from English name (uppercase)
                  </p>
                </div>

                {/* Categories List */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold flex items-center">
                      <FolderOpen className="h-5 w-5 mr-2" />
                      Existing Categories
                    </h3>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          fetchCategories();
                          fetchDetailedCategories();
                        }}
                        disabled={loadingCategories}
                      >
                        {loadingCategories ? (
                          <Loader2 className="animate-spin h-4 w-4" />
                        ) : (
                          "Refresh"
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Force refresh with cache-busting
                          const timestamp = Date.now();
                          fetch(`https://api.kmpyrotech.com/api/categories/public?t=${timestamp}&force=1`)
                            .then(res => res.json())
                            .then(data => {
                              setCategories(Array.isArray(data) ? data.map(cat => ({
                                ...cat,
                                displayName_en: cat.displayName_en || cat.displayName || cat.name,
                                displayName_ta: cat.displayName_ta || ''
                              })) : []);
                            })
                            .catch(console.error);
                        }}
                        disabled={loadingCategories}
                      >
                        Force Refresh
                      </Button>
                    </div>
                  </div>
                  {loadingCategories ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="animate-spin h-6 w-6 mr-2" />
                      Loading categories...
                    </div>
                  ) : categories.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No categories found</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categories.map((category) => (
                        <div 
                          key={category.name} 
                          className="bg-card rounded-lg shadow-card p-4 border border-border"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex-1">
                              <div className="font-semibold text-lg">{category.displayName_en}</div>
                              <div className="text-sm text-muted-foreground">{category.displayName_ta}</div>
                              <div className="text-sm text-muted-foreground">
                                {loadingCategoryCounts ? 'Loading...' : `${categoryProductCounts[category.name] || 0} products`}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleEditCategoryClick(category)}
                                className="ml-3"
                              >
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteCategory(category.name)}
                                disabled={isDeletingCategory}
                                className="ml-3"
                              >
                                {isDeletingCategory ? (
                                  <Loader2 className="animate-spin h-4 w-4" />
                                ) : (
                                  "Delete"
                                )}
                              </Button>
                            </div>
                          </div>

                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PRODUCT FORM */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>{t("addProduct")}</CardTitle>
              </CardHeader>
              <CardContent className="max-h-[70vh] overflow-y-auto">
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
                      <Label htmlFor="original_price">Original Price (₹)</Label>
                      <Input
                        id="original_price"
                        type="number"
                        value={productForm.original_price}
                        onChange={(e) =>
                          setProductForm((prev) => ({ ...prev, original_price: e.target.value }))
                        }
                        placeholder="(Optional)"
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
                            <SelectItem key={cat.name} value={cat.name}>
                              {cat.displayName_en}{cat.displayName_ta ? ` (${cat.displayName_ta})` : ''} {loadingCategoryCounts ? '(Loading...)' : `(${categoryProductCounts[cat.name] || 0} products)`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="youtube_url">YouTube Link (optional)</Label>
                    <Input
                      id="youtube_url"
                      type="url"
                      placeholder="https://youtube.com/..."
                      value={productForm.youtube_url}
                      onChange={(e) =>
                        setProductForm((prev) => ({ ...prev, youtube_url: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="image">Image</Label>
                    <div className="space-y-2">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                          className="mb-2"
                    />
                        {productForm.image && (
                          <p className="text-xs text-green-600 mb-2">
                            ✓ File selected: {productForm.image.name}
                          </p>
                        )}
                        <div className="text-center text-sm text-muted-foreground mb-2">OR</div>
                        <Input
                          id="imageUrl"
                          type="url"
                          placeholder="https://example.com/image.jpg"
                          value={productForm.imageUrl}
                                                  onChange={(e) => {
                          setProductForm((prev) => ({ ...prev, imageUrl: e.target.value, image: null }));
                          // Clear file input
                          const fileInput = document.getElementById('image') as HTMLInputElement;
                          if (fileInput) fileInput.value = '';
                        }}
                        />
                        {productForm.imageUrl && (
                          <p className="text-xs text-green-600 mt-2">
                            ✓ URL provided: {productForm.imageUrl.substring(0, 50)}...
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Upload an image file or provide an image URL (at least one is required)
                    </p>
                  </div>
                  <Button type="submit" className="w-full" disabled={isAddingProduct}>
                    {isAddingProduct ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="animate-spin h-5 w-5 mr-2" /> Adding...
                      </span>
                    ) : (
                      "Save Product"
                    )}
                  </Button>
                </form>
                <div className="h-4"></div> {/* Extra space at bottom */}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ORDER MANAGEMENT */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>{t("orderManagement")}</CardTitle>
              </CardHeader>
              <CardContent className="max-h-[70vh] overflow-y-auto">
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
                  {/* Order Status Filter Tabs */}
                  <div className="flex gap-2 mb-4">
                    {orderStatuses.map((status) => (
                      <button
                        key={status.value}
                        className={`px-4 py-1 rounded-full border text-sm font-medium transition-colors
                          ${orderStatusFilter === status.value
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50'}`}
                        onClick={() => setOrderStatusFilter(status.value)}
                      >
                        {status.label}
                      </button>
                    ))}
                  </div>
                  
                  {/* Payment Filter Tabs */}
                  <div className="flex gap-2 mb-4">
                    {paymentFilters.map((filter) => (
                      <button
                        key={filter.value}
                        className={`px-4 py-1 rounded-full border text-sm font-medium transition-colors
                          ${paymentFilter === filter.value
                            ? 'bg-orange-600 text-white border-orange-600'
                            : 'bg-white text-orange-700 border-orange-200 hover:bg-orange-50'}`}
                        onClick={() => setPaymentFilter(filter.value)}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                  {/* Filtered Orders */}
                  {(orders.filter(order => {
                    // Status filter
                    const statusMatch = orderStatusFilter === 'all' || order.status === orderStatusFilter;
                    
                    // Payment filter
                    let paymentMatch = true;
                    if (paymentFilter === 'with_payment') {
                      paymentMatch = !!order.paymentScreenshot;
                    } else if (paymentFilter === 'pending_verification') {
                      paymentMatch = order.paymentScreenshot && !order.paymentScreenshot.verified;
                    } else if (paymentFilter === 'verified') {
                      paymentMatch = order.paymentScreenshot && order.paymentScreenshot.verified;
                    }
                    
                    return statusMatch && paymentMatch;
                  })).map((order) => (
                    <div key={order.orderId} className="border border-border rounded-lg">
                      <div
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                        onClick={() => setExpandedOrderId(expandedOrderId === order.orderId ? null : order.orderId)}
                      >
                        <div>
                          <p className="font-bold">{order.orderId}</p>
                          <p className="text-sm text-muted-foreground">{order.customerDetails.fullName}</p>
                          <p className="text-sm text-muted-foreground">{order.customerDetails.mobile}</p>
                          <p className="text-primary font-medium">₹{order.total}</p>
                          {order.paymentScreenshot && (
                            <div className="flex items-center gap-2 mt-1">
                              {order.paymentScreenshot.verified ? (
                                <div className="flex items-center gap-1 text-green-600 text-xs">
                                  <CheckCircle className="w-3 h-3" />
                                  <span>Payment Verified</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 text-orange-600 text-xs">
                                  <Eye className="w-3 h-3" />
                                  <span>Payment Pending</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                          <Select
                            defaultValue={order.status}
                            onValueChange={(val) => handleStatusUpdate(order.orderId, val)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="booked">Booked</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="flex gap-1">
                            {order.paymentScreenshot && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={e => { e.stopPropagation(); setPaymentViewOrder(order); }}
                              >
                                <Eye className="w-3 h-3" />
                              </Button>
                            )}
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={e => { e.stopPropagation(); handleDeleteOrder(order.orderId); }}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                      {expandedOrderId === order.orderId && (
                        <div className="bg-blue-50 p-4 border-l-4 border-blue-400 rounded-b-lg transition-all">
                          <h4 className="font-semibold mb-2 text-blue-700">Ordered Products</h4>
                          <div className="mb-4">
                            <p className="text-sm text-blue-700 font-medium">Delivery Address:</p>
                            <p className="text-sm text-blue-900">{order.customerDetails.address}</p>
                            <p className="text-xs text-blue-500">Pincode: {order.customerDetails.pincode}</p>
                          </div>
                          <div className="space-y-2">
                            {order.items && order.items.length > 0 ? (
                              order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between border-b border-blue-100 pb-2 last:border-b-0">
                                  <div>
                                    <p className="font-medium text-blue-900">{item.name_en} <span className="text-xs text-blue-500">({item.name_ta})</span></p>
                                    <p className="text-xs text-blue-400">Category: {item.category}</p>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <span className="text-sm text-blue-700">Qty: {item.quantity}</span>
                                    <span className="text-sm text-blue-900 font-semibold">₹{item.price}</span>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-blue-400">No products found in this order.</p>
                            )}
                          </div>
                          <div className="mt-4 flex flex-col md:flex-row gap-4 items-center">
                            <Input
                              placeholder="Transport Name"
                              value={transportInputs[order.orderId]?.transportName ?? order.transportName ?? ''}
                              onChange={e => handleTransportInputChange(order.orderId, 'transportName', e.target.value)}
                              className="w-48"
                            />
                            <Input
                              placeholder="LR Number"
                              value={transportInputs[order.orderId]?.lrNumber ?? order.lrNumber ?? ''}
                              onChange={e => handleTransportInputChange(order.orderId, 'lrNumber', e.target.value)}
                              className="w-48"
                            />
                            <Button
                              onClick={() => handleTransportSubmit(order.orderId)}
                              disabled={order.status === 'booked' || !transportInputs[order.orderId]?.transportName || !transportInputs[order.orderId]?.lrNumber}
                            >
                              {order.status === 'booked' ? 'Booked' : 'Set as Booked'}
                            </Button>
                          </div>
                          {order.transportName && order.lrNumber && (
                            <div className="mt-2 text-sm text-blue-700">
                              <span className="font-semibold">Transport:</span> {order.transportName} <span className="ml-4 font-semibold">LR No:</span> {order.lrNumber}
                            </div>
                          )}
                          
                          {/* Payment Screenshot Section */}
                          {order.paymentScreenshot && (
                            <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                              <h4 className="font-semibold mb-2 text-orange-700">Payment Screenshot</h4>
                              <div className="flex items-center justify-between">
                                <div className="text-sm text-orange-700">
                                  <p><strong>Uploaded:</strong> {new Date(order.paymentScreenshot.uploadedAt).toLocaleString()}</p>
                                  <p><strong>Status:</strong> {order.paymentScreenshot.verified ? 'Verified' : 'Pending Verification'}</p>
                                  {order.paymentScreenshot.verified && (
                                    <p><strong>Verified by:</strong> {order.paymentScreenshot.verifiedBy} on {new Date(order.paymentScreenshot.verifiedAt).toLocaleString()}</p>
                                  )}
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setPaymentViewOrder(order)}
                                  className="border-orange-300 text-orange-700 hover:bg-orange-100"
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  View Screenshot
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ANALYTICS */}
          <TabsContent value="analytics">
            <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-center">
              <Label htmlFor="analytics-date">Filter by Date</Label>
              <input
                id="analytics-date"
                type="date"
                className="border rounded-md p-2 bg-background text-foreground"
                value={analyticsDate}
                onChange={e => setAnalyticsDate(e.target.value)}
              />
              {analyticsDate && (
                <Button size="sm" variant="outline" onClick={() => setAnalyticsDate("")}>Clear</Button>
              )}
            </div>
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
                      {analyticsDate ? analyticsDayStats.totalOrders : analytics.totalOrders}
                    </p>
                    <p className="text-muted-foreground text-sm">{analyticsDate ? analyticsDate : "All time"}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Total Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-primary">
                      ₹{(analyticsDate ? analyticsDayStats.totalRevenue : analytics.totalRevenue || 0).toLocaleString()}
                    </p>
                    <p className="text-muted-foreground text-sm">{analyticsDate ? analyticsDate : "All time"}</p>
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
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <Label htmlFor="edit_name_en">Product Name (English)</Label>
              <Input
                id="edit_name_en"
                value={editForm.name_en}
                onChange={e => handleEditFormChange("name_en", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit_name_ta">Product Name (Tamil)</Label>
              <Input
                id="edit_name_ta"
                value={editForm.name_ta}
                onChange={e => handleEditFormChange("name_ta", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit_price">Price (₹)</Label>
              <Input
                id="edit_price"
                type="number"
                value={editForm.price}
                onChange={e => handleEditFormChange("price", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit_original_price">Original Price (₹)</Label>
              <Input
                id="edit_original_price"
                type="number"
                value={editForm.original_price}
                onChange={e => handleEditFormChange("original_price", e.target.value)}
                placeholder="(Optional)"
              />
            </div>
            <div>
              <Label htmlFor="edit_category">Category</Label>
              <Select
                value={editForm.category}
                onValueChange={value => handleEditFormChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.name} value={cat.name}>
                      {cat.displayName_en}{cat.displayName_ta ? ` (${cat.displayName_ta})` : ''} {loadingCategoryCounts ? '(Loading...)' : `(${categoryProductCounts[cat.name] || 0} products)`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit_youtube_url">YouTube Link (optional)</Label>
              <Input
                id="edit_youtube_url"
                type="url"
                placeholder="https://youtube.com/..."
                value={editForm.youtube_url}
                onChange={e => handleEditFormChange("youtube_url", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="edit_image">Image</Label>
              <div className="space-y-2">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <Input
                id="edit_image"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleEditImageUpload}
                    className="mb-2"
              />
                  {editForm.image && (
                    <p className="text-xs text-green-600 mb-2">
                      ✓ File selected: {editForm.image.name}
                    </p>
                  )}
                  <div className="text-center text-sm text-muted-foreground mb-2">OR</div>
                  <Input
                    id="edit_imageUrl"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={editForm.imageUrl}
                                            onChange={e => {
                          handleEditFormChange("imageUrl", e.target.value);
                          handleEditFormChange("image", null);
                          // Clear file input
                          const fileInput = document.getElementById('edit_image') as HTMLInputElement;
                          if (fileInput) fileInput.value = '';
                        }}
                  />
                  {editForm.imageUrl && (
                    <p className="text-xs text-green-600 mt-2">
                      ✓ URL provided: {editForm.imageUrl.substring(0, 50)}...
                    </p>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Upload an image file or provide an image URL (optional - will keep current image if none provided)
              </p>
              {editProduct && (editProduct.imageUrl || editProduct.image_url) && (
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground mb-1">Current image:</p>
                  <img src={editProduct.imageUrl || editProduct.image_url} alt="Current" className="h-20 rounded" />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button type="submit" className="ml-2">Save Changes</Button>
            </DialogFooter>
          </form>
          <div className="h-4"></div> {/* Extra space at bottom */}
        </DialogContent>
      </Dialog>

      {/* Category Edit Dialog */}
      <Dialog open={isEditingCategory} onOpenChange={setIsEditingCategory}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditCategorySubmit} className="space-y-4">
            <div>
              <Label htmlFor="edit_displayName_en">Display Name (English)</Label>
              <Input
                id="edit_displayName_en"
                value={editCategoryForm.displayName_en}
                onChange={e => handleEditCategoryFormChange("displayName_en", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit_displayName_ta">Display Name (Tamil)</Label>
              <Input
                id="edit_displayName_ta"
                value={editCategoryForm.displayName_ta}
                onChange={e => handleEditCategoryFormChange("displayName_ta", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="edit_iconUrl">Icon Image URL</Label>
              <Input
                id="edit_iconUrl"
                placeholder="https://.../image.png"
                value={editCategoryForm.iconUrl}
                onChange={e => handleEditCategoryFormChange("iconUrl", e.target.value)}
              />
              {editCategoryForm.iconUrl ? (
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground mb-1">Preview:</p>
                  <img src={editCategoryForm.iconUrl} alt="Preview" className="h-16 w-16 rounded-full object-cover border" />
                </div>
              ) : null}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditingCategory(false)}>
                Cancel
              </Button>
              <Button type="submit" className="ml-2">Save Changes</Button>
            </DialogFooter>
          </form>
          <div className="h-4"></div> {/* Extra space at bottom */}
        </DialogContent>
      </Dialog>
      {/* DISCOUNT SECTION */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Set Discount for All Products</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleApplyDiscount} className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex flex-col">
              <Label htmlFor="discount">Discount Percentage (%)</Label>
              <Input
                id="discount"
                type="number"
                min="0"
                max="100"
                value={discount}
                onChange={e => setDiscount(e.target.value)}
                placeholder="e.g. 10"
                className="w-32"
              />
            </div>
            <Button type="submit" className="mt-2 sm:mt-0" disabled={isApplyingDiscount}>
              {isApplyingDiscount ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null}
              Apply Discount
            </Button>
          </form>
          <p className="text-muted-foreground text-xs mt-2">This will update the price of all products to the given percentage off their original price.</p>
        </CardContent>
      </Card>

      {/* NOTIFICATION SECTION */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Send Push Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendNotification} className="space-y-4">
            <div>
              <Label htmlFor="notification-title">Notification Title</Label>
              <Input
                id="notification-title"
                value={notificationForm.title}
                onChange={e => setNotificationForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. New Offers Available!"
                required
              />
            </div>
            <div>
              <Label htmlFor="notification-body">Notification Message</Label>
              <Input
                id="notification-body"
                value={notificationForm.body}
                onChange={e => setNotificationForm(prev => ({ ...prev, body: e.target.value }))}
                placeholder="e.g. Check out our latest fireworks collection with amazing discounts!"
                required
              />
            </div>
            <Button type="submit" disabled={isSendingNotification}>
              {isSendingNotification ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null}
              Send Notification to All Users
            </Button>
          </form>
          <p className="text-muted-foreground text-xs mt-2">This will send a push notification to all users who have enabled notifications.</p>
        </CardContent>
      </Card>

      {/* Payment Screenshot Viewer Dialog */}
      <Dialog open={!!paymentViewOrder} onOpenChange={() => setPaymentViewOrder(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Payment Screenshot - Order {paymentViewOrder?.orderId}</DialogTitle>
          </DialogHeader>
          {paymentViewOrder && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="text-sm">
                  <p><strong>Customer:</strong> {paymentViewOrder.customerDetails.fullName}</p>
                  <p><strong>Mobile:</strong> {paymentViewOrder.customerDetails.mobile}</p>
                  <p><strong>Amount:</strong> ₹{paymentViewOrder.total}</p>
                  <p><strong>Uploaded:</strong> {new Date(paymentViewOrder.paymentScreenshot.uploadedAt).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">
                    <strong>Status:</strong> 
                    <span className={`ml-1 ${paymentViewOrder.paymentScreenshot.verified ? 'text-green-600' : 'text-orange-600'}`}>
                      {paymentViewOrder.paymentScreenshot.verified ? 'Verified' : 'Pending Verification'}
                    </span>
                  </p>
                </div>
              </div>
              
              <div className="flex justify-center">
                <img 
                  src={paymentViewOrder.paymentScreenshot.imageUrl} 
                  alt="Payment Screenshot" 
                  className="max-w-full max-h-96 object-contain border rounded-lg"
                />
              </div>
              
              {!paymentViewOrder.paymentScreenshot.verified && (
                <DialogFooter className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setPaymentViewOrder(null)}
                    disabled={isVerifyingPayment}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleVerifyPayment(paymentViewOrder.orderId, false)}
                    disabled={isVerifyingPayment}
                  >
                    {isVerifyingPayment ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Rejecting...
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject Payment
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => handleVerifyPayment(paymentViewOrder.orderId, true)}
                    disabled={isVerifyingPayment}
                  >
                    {isVerifyingPayment ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Verify Payment
                      </>
                    )}
                  </Button>
                </DialogFooter>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;