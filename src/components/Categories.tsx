import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Loader } from './ui/loader';
import { ProductCard } from './ProductCard';
import { useCart } from '../hooks/useCart';
import { useIsMobile } from '../hooks/use-mobile';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Category {
  name: string;
  displayName: string;
  displayName_en?: string;
  displayName_ta?: string;
}

interface Product {
  _id?: string;
  id?: string;
  name_en: string;
  name_ta: string;
  price: number;
  original_price?: number;
  imageUrl?: string;
  image_url?: string;
  category: string;
  youtube_url?: string;
}

export const Categories = () => {
  const { addToCart, cartItems, updateQuantity } = useCart();
  const isMobile = useIsMobile();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCategoryInfo, setSelectedCategoryInfo] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  console.log('🔍 Categories Component Debug:');
  console.log('📱 isMobile:', isMobile);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchProducts(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching categories...');
      const res = await fetch('https://cracker-backend-rvta.onrender.com/api/categories/public');
      const data = await res.json();
      
      console.log('📋 Categories response:', data);
      
      if (res.ok) {
        // If no categories found in API, fall back to mock data
        if (!Array.isArray(data) || data.length === 0) {
          console.log('⚠️ No categories found in API, using mock data');
          const { getCategoriesWithCount } = await import('../data/mockData');
          const mockCategories = getCategoriesWithCount();
          const transformedMockCategories = mockCategories.map((cat: any) => ({
            name: cat.name,
            displayName: cat.name,
            displayName_en: cat.name,
            displayName_ta: "",
            productCount: cat.count || 0
          }));
          setCategories(transformedMockCategories);
          setError(null);
          
          // Auto-select SPARKLERS category if available, otherwise first category
          if (transformedMockCategories.length > 0) {
            const sparklersCategory = transformedMockCategories.find(cat => 
              cat.name.toUpperCase().includes('SPARKLER') || 
              cat.displayName.toUpperCase().includes('SPARKLER')
            );
            if (sparklersCategory && !selectedCategory) {
              console.log('✅ Auto-selecting SPARKLERS category:', sparklersCategory.name);
              setSelectedCategory(sparklersCategory.name);
              setSelectedCategoryInfo(sparklersCategory);
            } else if (!selectedCategory) {
              console.log('✅ Auto-selecting first category:', transformedMockCategories[0].name);
              setSelectedCategory(transformedMockCategories[0].name);
              setSelectedCategoryInfo(transformedMockCategories[0]);
            }
          }
          return;
        }
        
        setCategories(data);
        setError(null);
        // Auto-select SPARKLERS category if available, otherwise first category
        if (data.length > 0) {
          const sparklersCategory = data.find(cat => 
            cat.name.toUpperCase().includes('SPARKLER') || 
            cat.displayName.toUpperCase().includes('SPARKLER')
          );
          if (sparklersCategory && !selectedCategory) {
            console.log('✅ Auto-selecting SPARKLERS category:', sparklersCategory.name);
            setSelectedCategory(sparklersCategory.name);
            setSelectedCategoryInfo(sparklersCategory);
          } else if (!selectedCategory) {
            console.log('✅ Auto-selecting first category:', data[0].name);
            setSelectedCategory(data[0].name);
            setSelectedCategoryInfo(data[0]);
          }
        }
      } else {
        console.error('❌ Categories fetch failed:', data.error);
        setError(data.error || 'Failed to fetch categories');
      }
    } catch (err) {
      console.error('❌ Categories fetch error:', err);
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (categoryName: string) => {
    try {
      setLoadingProducts(true);
      console.log('🔄 Fetching products for category:', categoryName);
      
      // Add cache busting parameter
      const timestamp = Date.now();
      const res = await fetch(`https://cracker-backend-rvta.onrender.com/api/products/category/${encodeURIComponent(categoryName)}?t=${timestamp}`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      const data = await res.json();
      
      console.log('📦 Products response:', data);
      
      if (res.ok) {
        setProducts(data);
        console.log(`✅ Loaded ${data.length} products for ${categoryName}`);
        
        // Debug image URLs
        data.forEach((product: any, index: number) => {
          console.log(`🖼️ Product ${index + 1}:`, {
            name: product.name_en,
            imageUrl: product.imageUrl,
            image_url: product.image_url,
            hasImage: !!(product.imageUrl || product.image_url)
          });
        });
      } else {
        console.error('❌ Products fetch failed:', data.error);
        setProducts([]);
      }
    } catch (err) {
      console.error('❌ Products fetch error:', err);
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleCategorySelect = (categoryName: string) => {
    console.log('🎯 Category selected:', categoryName);
    setSelectedCategory(categoryName);
    
    // Find the category info for display
    const categoryInfo = categories.find(cat => cat.name === categoryName);
    setSelectedCategoryInfo(categoryInfo || null);
    
    setIsCategoryDropdownOpen(false); // Close dropdown when category is selected
    fetchProducts(categoryName);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="h-8 w-8" />
        <span className="ml-2 text-muted-foreground">Loading categories...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={fetchCategories} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">No Categories Found</h3>
        <p className="text-muted-foreground">Check back later for available categories.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Header with Category Dropdown */}
      <div className="sticky top-0 z-30 bg-card border-b border-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Categories</h3>
            
            {/* Category Dropdown (Portal) */}
            <Select
              value={selectedCategory || undefined}
              onValueChange={(val) => handleCategorySelect(val)}
            >
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.name} value={category.name}>
                    {category.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={() => window.history.back()} 
            variant="ghost" 
            size="sm"
            className="h-10 w-10 p-0"
          >
            ←
          </Button>
        </div>
      </div>

      {/* Products Section */}
      <div className="p-4">
        {selectedCategory ? (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">
                {selectedCategoryInfo?.displayName || selectedCategory}
              </h2>
              {selectedCategoryInfo?.displayName_ta && (
                <h3 className="text-lg text-muted-foreground mb-2">
                  {selectedCategoryInfo.displayName_ta}
                </h3>
              )}
              <p className="text-muted-foreground">
                Browse products in this category
              </p>
            </div>

            {loadingProducts ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="h-8 w-8" />
                <span className="ml-2 text-muted-foreground">Loading products...</span>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">No Products Found</h3>
                <p className="text-muted-foreground">
                  No products available in {selectedCategoryInfo?.displayName || selectedCategory} category yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {products.map((product) => {
                  const quantity = cartItems.find(item => item.id === (product._id || product.id))?.quantity || 0;
                  return (
                    <div key={product._id || product.id}>
                      <ProductCard
                        product={{
                          id: product._id || product.id,
                          name_en: product.name_en,
                          name_ta: product.name_ta,
                          price: product.price,
                          original_price: product.original_price,
                          imageUrl: product.imageUrl || product.image_url,
                          category: product.category,
                          youtube_url: product.youtube_url,
                        }}
                        onAddToCart={addToCart}
                        onRemoveFromCart={() => updateQuantity(product._id || product.id, quantity - 1)}
                        quantity={quantity}
                        size="sm"
                        categoryDisplayName={selectedCategoryInfo?.displayName || selectedCategory}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">Select a Category</h3>
            <p className="text-muted-foreground">
              Use the dropdown above to select a category
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
