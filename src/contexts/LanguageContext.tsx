import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  language: 'en' | 'ta';
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  en: {
    // Navigation
    home: 'Home',
    categories: 'Categories',
    cart: 'Cart',
    trackOrder: 'Track Order',
    
    // Homepage
    heroTitle: 'KMPyrotech',
    heroSubtitle: 'Light up your festivals with premium quality fireworks. Celebrate Diwali with our authentic crackers collection.',
    shopNow: 'Shop Now',
    allCategories: 'All Categories',
    featureQuality: 'Premium Quality',
    featureQualityDesc: 'Authentic fireworks with the highest safety standards',
    featureDelivery: 'Fast Delivery',
    featureDeliveryDesc: 'Quick and safe delivery to your doorstep',
    featureOffers: 'Festival Offers',
    featureOffersDesc: 'Special discounts for all major festivals',
    
    // Categories
    exploreCategories: 'Explore our complete collection of premium fireworks and crackers',
    items: 'items',
    
    // Cart
    myCart: 'My Cart',
    cartEmpty: 'Your cart is empty',
    continueShopping: 'Continue Shopping',
    proceedToCheckout: 'Proceed to Checkout',
    total: 'Total',
    minOrderAlert: 'Minimum order is ₹1,000. Please add more items to proceed to checkout.',
    minOrderButton: 'Minimum order ₹1,000 required',
    
    // Checkout
    checkout: 'Checkout',
    personalInfo: 'Personal Information',
    fullName: 'Full Name',
    mobileNumber: 'Mobile Number',
    email: 'Email Address',
    deliveryAddress: 'Delivery Address',
    pincode: 'Pincode',
    paymentMethod: 'Payment Method',
    codOnly: 'Cash on Delivery Only',
    placeOrder: 'Place Order',
    
    // Order Tracking
    trackYourOrder: 'Track Your Order',
    orderStatus: 'Order Status',
    confirmed: 'Confirmed',
    packed: 'Packed',
    shipped: 'Shipped',
    delivered: 'Delivered',
    
    // Footer
    aboutUs: 'About Us',
    contactUs: 'Contact Us',
    privacyPolicy: 'Privacy Policy',
    termsConditions: 'Terms & Conditions',
    followUs: 'Follow Us',
    
    // Admin
    adminPanel: 'Admin Panel',
    addProduct: 'Add Product',
    productName: 'Product Name',
    price: 'Price',
    category: 'Category',
    image: 'Product Image',
    saveProduct: 'Save Product',
    orderManagement: 'Order Management',
    updateStatus: 'Update Status',
  },
  ta: {
    // Navigation
    home: 'முகப்பு',
    categories: 'வகைகள்',
    cart: 'கூடை',
    trackOrder: 'ஆர்டர் ட்ராக்',
    
    // Homepage
    heroTitle: 'கே.எம் பட்டாசுகள்',
    heroSubtitle: 'உங்கள் திருவிழாக்களை உயர்தர பட்டாசுகளுடன் ஒளிரச் செய்யுங்கள். எங்கள் அசல் பட்டாசு தொகுப்புடன் தீபாவளியை கொண்டாடுங்கள்.',
    shopNow: 'இப்போது வாங்கவும்',
    allCategories: 'அனைத்து வகைகள்',
    featureQuality: 'உயர்தர பட்டாசுகள்',
    featureQualityDesc: 'உயர்ந்த பாதுகாப்பு தரத்துடன் அசல் பட்டாசுகள்',
    featureDelivery: 'விரைவு டெலிவரி',
    featureDeliveryDesc: 'உங்கள் வீடுபதிக்க விரைவாகவும் பாதுகாப்பாகவும் டெலிவரி',
    featureOffers: 'திருவிழா சலுகைகள்',
    featureOffersDesc: 'அனைத்து முக்கிய திருவிழாக்களுக்கும் சிறப்பு தள்ளுபடி',
    
    // Categories
    exploreCategories: 'எங்கள் உயர்தர பட்டாசுகள் மற்றும் வெடிகளின் முழுமையான சேகரிப்பை ஆராயுங்கள்',
    items: 'பொருட்கள்',
    
    // Cart
    myCart: 'என் கூடை',
    cartEmpty: 'உங்கள் கூடை காலியாக உள்ளது',
    continueShopping: 'வாங்குதலைத் தொடரவும்',
    proceedToCheckout: 'செக்அவுட்டுக்கு செல்லவும்',
    total: 'மொத்தம்',
    minOrderAlert: 'குறைந்தபட்ச ஆர்டர் ₹1,000. தொடர மேலும் பொருட்களைச் சேர்க்கவும்.',
    minOrderButton: 'குறைந்தபட்சம் ₹1,000 தேவை',
    
    // Checkout
    checkout: 'செக்அவுட்',
    personalInfo: 'தனிப்பட்ட தகவல்',
    fullName: 'முழு பெயர்',
    mobileNumber: 'மொபைல் எண்',
    email: 'மின்னஞ்சல் முகவரி',
    deliveryAddress: 'டெலிவரி முகவரி',
    pincode: 'பின்கோட்',
    paymentMethod: 'பணம் செலுத்தும் முறை',
    codOnly: 'பணம் வழங்கும்போது மட்டுமே',
    placeOrder: 'ஆர்டர் செய்யவும்',
    
    // Order Tracking
    trackYourOrder: 'உங்கள் ஆர்டரைக் கண்காணிக்கவும்',
    orderStatus: 'ஆர்டர் நிலை',
    confirmed: 'உறுதிப்படுத்தப்பட்டது',
    packed: 'பேக் செய்யப்பட்டது',
    shipped: 'அனுப்பப்பட்டது',
    delivered: 'வழங்கப்பட்டது',
    
    // Footer
    aboutUs: 'எங்களை பற்றி',
    contactUs: 'எங்களை தொடர்பு கொள்ளவும்',
    privacyPolicy: 'தனியுரிமை கொள்கை',
    termsConditions: 'விதிமுறைகள் மற்றும் நிபந்தனைகள்',
    followUs: 'எங்களைப் பின்தொடரவும்',
    
    // Admin
    adminPanel: 'நிர்வாக பேனல்',
    addProduct: 'தயாரிப்பு சேர்க்கவும்',
    productName: 'தயாரிப்பு பெயர்',
    price: 'விலை',
    category: 'வகை',
    image: 'தயாரிப்பு படம்',
    saveProduct: 'தயாரிப்பை சேமிக்கவும்',
    orderManagement: 'ஆர்டர் மேலாண்மை',
    updateStatus: 'நிலையைப் புதுப்பிக்கவும்',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'ta'>('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ta' : 'en');
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};