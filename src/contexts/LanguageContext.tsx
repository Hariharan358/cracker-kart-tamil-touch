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
    safety_Guidance: 'Safety Guidance',
    
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
    
    // Safety
    safetyGuidance: 'Fireworks Safety Guidance',
    safetyDescription: 'There are certain Dos & Don\'ts to follow while purchasing, bursting and storing crackers. Thus, it is very important to follow the precautions while bursting crackers. A little negligence, ignorance and carelessness can cause a fatal injury.',
    dos: 'Do\'s',
    donts: 'Don\'ts',
    backToShopping: 'Back to Shopping',
    
    // Safety Do's
    followInstructions: 'Follow Instructions: Display fireworks as per the instructions mentioned on the pack.',
    outdoorUseOnly: 'Outdoor Use Only: Use fireworks only outdoor.',
    useBrandedFireworks: 'Use Branded Fireworks: Buy fireworks from authorized/reputed manufacturers only.',
    keepSafeDistance: 'Keep Safe Distance: Light only one firework at a time, by one person. Others should watch from a safe distance.',
    followSafetyTips: 'Follow Safety Tips: Always follow the safety tips marked on the fireworks.',
    useAgarbatti: 'Use Agarbatti: Use an agarbatti to ignite the fireworks.',
    safeStorage: 'Safe Storage: Store fireworks in a cool and dry place.',
    needsSupervision: 'Needs Supervision: Always have adult supervision.',
    emergencyWater: 'Emergency Water: Keep two buckets of water handy. In the event of fire or any mishap.',
    
    // Safety Don'ts
    dontMakeTricks: 'Don\'t make tricks: Never make your own fireworks.',
    dontRelight: 'Don\'t relight: Never try to re-light or pick up fireworks that have not ignited fully.',
    dontCarryIt: 'Don\'t carry it: Never carry fireworks in your pockets.',
    dontUseGlassMetal: 'Do not use Glass / Metal: Never shoot fireworks in metal or glass containers.',
    dontThrow: 'Do not Throw: Never point or throw fireworks at another person.',
    dontWearLooseClothes: 'Don\'t wear loose clothes: Do not wear loose clothing while using fireworks.',
    dontTouchIt: 'Don\'t Touch it: After the fireworks display never pick up fireworks that may be leftover, they still may be active.',
    dontPlaceNearCandles: 'Don\'t place near candles: Don\'t store firecrackers near burning candles or lamps.',
    dontDrinkAndBurst: 'Don\'t Drink & Burst Crackers: Alcohol causes delayed body responses & crackers might burst early.',
    
    // Category Names
    sparklerItems: 'SPARKLER ITEMS',
    flowerPots: 'FLOWER POTS',
    chakkars: 'CHAKKARS',
    twinkling: 'TWINKLING',
    colourFountainWindowBig: 'COLOUR FOUNTAIN WINDOW BIG',
    colorWindowFountain3Inch: 'Color Window Fountain 3 Inch',
    enjoyPencial: 'ENJOY PENCIAL',
    oneSoundCrackers: 'ONE SOUND CRACKERS',
    bijili: 'BIJILI',
    rocketBomb: 'ROCKET BOMB',
    atomBomb: 'ATOM BOMB',
    gaintAndDeluxe: 'GAINT & DELUXE',
    redMiracleOther: 'RED MIRACLE (OTHER)',
    redMiracleBrands: 'RED MIRACLE (Brands)',
    babyFancyNovelties: 'BABY FANCY NOVELTIES',
    multiColourShotBrand: 'MULTI COLOUR SHOT BRAND',
    multiColourShotOthers: 'MULTI COLOUR SHOT-Others',
    colourPaperMusicalOut: 'COLOUR PAPER MUSICAL OUT',
    megaDisplaySerious: 'MEGA DISPLAY SERIOUS',
    megaFountain: 'MEGA FOUNTAIN',
    miniAerialChottaFancy: 'MINI AERIAL CHOTTA FACNY',
    megaDisplay: 'MEGA DISPLAY',
    gujarathFlowerPots: 'GUJARATH FLOWER POTS',
    newColourFountainSky: 'NEW COLOUR FOUNTAIN SKY',
    colourSmokeFountain: 'COLOUR SMOKE FOUNTAIN',
    matchesBox: 'MATCHES BOX',
    kannan5PieceGiftBox: 'KANNAN 5 PIECE GIFT BOX',
    guns: 'GUNS',
    nattuVedi: 'NATTU VEDI',
    familyPack: 'FAMILY PACK',
    giftBox: 'GIFT BOX',
    
    // Category Page
    backToCategories: 'Back to Categories',
    productsAvailable: 'products available',
    noProductsInCategory: 'No products available in this category yet.',
    browseOtherCategories: 'Browse Other Categories',
  },
  ta: {
    // Navigation
    home: 'முகப்பு',
    categories: 'வகைகள்',
    cart: 'கூடை',
    trackOrder: 'ஆர்டர் ட்ராக்',
    safety_Guidance: 'பட்டாசு பாதுகாப்பு வழிகாட்டுதல்',
    
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
    
    // Safety
    safetyGuidance: 'பட்டாசு பாதுகாப்பு வழிகாட்டுதல்',
    safetyDescription: 'பட்டாசுகளை வாங்கும், வெடிக்கும் மற்றும் சேமிக்கும் போது பின்பற்ற வேண்டிய சில செய்ய வேண்டியவை மற்றும் செய்யக்கூடாதவை உள்ளன. எனவே, பட்டாசுகளை வெடிக்கும் போது முன்னெச்சரிக்கைகளைப் பின்பற்றுவது மிகவும் முக்கியம். சிறிய அலட்சியம், அறியாமை மற்றும் கவனக்குறைவு ஆபத்தான காயத்தை ஏற்படுத்தலாம்.',
    dos: 'செய்ய வேண்டியவை',
    donts: 'செய்யக்கூடாதவை',
    backToShopping: 'வாங்குதலைத் தொடரவும்',
    
    // Safety Do's
    followInstructions: 'வழிமுறைகளைப் பின்பற்றவும்: பேக்கில் குறிப்பிடப்பட்ட வழிமுறைகளின்படி பட்டாசுகளை காட்சிப்படுத்தவும்.',
    outdoorUseOnly: 'வெளிப்புற பயன்பாடு மட்டும்: பட்டாசுகளை வெளியே மட்டும் பயன்படுத்தவும்.',
    useBrandedFireworks: 'பிராண்டட் பட்டாசுகளைப் பயன்படுத்தவும்: அங்கீகரிக்கப்பட்ட/நம்பகமான உற்பத்தியாளர்களிடமிருந்து மட்டும் பட்டாசுகளை வாங்கவும்.',
    keepSafeDistance: 'பாதுகாப்பான தூரத்தை வைத்துக்கொள்ளவும்: ஒரு நேரத்தில் ஒரு பட்டாசை மட்டும், ஒரு நபரால் எரியவிடவும். மற்றவர்கள் பாதுகாப்பான தூரத்திலிருந்து பார்த்துக்கொள்ள வேண்டும்.',
    followSafetyTips: 'பாதுகாப்பு குறிப்புகளைப் பின்பற்றவும்: பட்டாசுகளில் குறிக்கப்பட்ட பாதுகாப்பு குறிப்புகளை எப்போதும் பின்பற்றவும்.',
    useAgarbatti: 'அகிர்பத்தி பயன்படுத்தவும்: பட்டாசுகளை எரியவிட அகிர்பத்தி பயன்படுத்தவும்.',
    safeStorage: 'பாதுகாப்பான சேமிப்பு: பட்டாசுகளை குளிர்ந்த மற்றும் வறண்ட இடத்தில் சேமிக்கவும்.',
    needsSupervision: 'மேற்பார்வை தேவை: எப்போதும் பெரியவர்களின் மேற்பார்வையுடன் இருக்கவும்.',
    emergencyWater: 'அவசரகால தண்ணீர்: இரண்டு வாளி தண்ணீரை கையில் வைத்துக்கொள்ளவும். தீ அல்லது எந்த விபத்து ஏற்பட்டாலும்.',
    
    // Safety Don'ts
    dontMakeTricks: 'தந்திரங்களை செய்ய வேண்டாம்: உங்கள் சொந்த பட்டாசுகளை ஒருபோதும் செய்ய வேண்டாம்.',
    dontRelight: 'மீண்டும் எரியவிட வேண்டாம்: முழுமையாக எரியாத பட்டாசுகளை மீண்டும் எரியவிட அல்லது எடுக்க முயற்சிக்க வேண்டாம்.',
    dontCarryIt: 'அதை எடுத்துச் செல்ல வேண்டாம்: பட்டாசுகளை உங்கள் பைகளில் ஒருபோதும் எடுத்துச் செல்ல வேண்டாம்.',
    dontUseGlassMetal: 'கண்ணாடி / உலோகத்தைப் பயன்படுத்த வேண்டாம்: உலோக அல்லது கண்ணாடி கொள்கலன்களில் பட்டாசுகளை ஒருபோதும் சுட வேண்டாம்.',
    dontThrow: 'எறிய வேண்டாம்: பட்டாசுகளை வேறு நபரை நோக்கி சுட்டிக்காட்ட அல்லது எறிய வேண்டாம்.',
    dontWearLooseClothes: 'தளர்வான ஆடைகளை அணிய வேண்டாம்: பட்டாசுகளைப் பயன்படுத்தும் போது தளர்வான ஆடைகளை அணிய வேண்டாம்.',
    dontTouchIt: 'அதைத் தொட வேண்டாம்: பட்டாசு காட்சிக்குப் பிறகு மீதமுள்ள பட்டாசுகளை ஒருபோதும் எடுக்க வேண்டாம், அவை இன்னும் செயலில் இருக்கலாம்.',
    dontPlaceNearCandles: 'மெழுகுவர்த்திகளுக்கு அருகில் வைக்க வேண்டாம்: எரியும் மெழுகுவர்த்திகள் அல்லது விளக்குகளுக்கு அருகில் வெடிகளை சேமிக்க வேண்டாம்.',
    dontDrinkAndBurst: 'குடித்து பட்டாசுகளை வெடிக்க வேண்டாம்: மது உடலின் தாமதமான எதிர்வினைகளை ஏற்படுத்தும் மற்றும் பட்டாசுகள் முன்கூட்டியே வெடிக்கலாம்.',
    
    // Category Names
    sparklerItems: 'ஸ்பார்க்லர் பொருட்கள்',
    flowerPots: 'மலர் பானைகள்',
    chakkars: 'சக்கர்கள்',
    twinkling: 'மின்னும் பொருட்கள்',
    colourFountainWindowBig: 'வண்ண நீரூற்று சாளரம் பெரியது',
    colorWindowFountain3Inch: 'வண்ண சாளர நீரூற்று 3 அங்குலம்',
    enjoyPencial: 'என்ஜாய் பென்சில்',
    oneSoundCrackers: 'ஒரு ஒலி வெடிகள்',
    bijili: 'பிஜிலி',
    rocketBomb: 'ராக்கெட் குண்டு',
    atomBomb: 'அணு குண்டு',
    gaintAndDeluxe: 'பெரிய மற்றும் டீலக்ஸ்',
    redMiracleOther: 'சிவப்பு அதிசயம் (மற்றவை)',
    redMiracleBrands: 'சிவப்பு அதிசயம் (பிராண்டுகள்)',
    babyFancyNovelties: 'குழந்தை ஃபான்சி புதுமைகள்',
    multiColourShotBrand: 'பல வண்ண ஷாட் பிராண்டு',
    multiColourShotOthers: 'பல வண்ண ஷாட்-மற்றவை',
    colourPaperMusicalOut: 'வண்ண காகித இசை வெளியே',
    megaDisplaySerious: 'மெகா காட்சி தீவிரம்',
    megaFountain: 'மெகா நீரூற்று',
    miniAerialChottaFancy: 'மினி வான்வழி சோட்டா ஃபான்சி',
    megaDisplay: 'மெகா காட்சி',
    gujarathFlowerPots: 'குஜராத் மலர் பானைகள்',
    newColourFountainSky: 'புதிய வண்ண நீரூற்று வானம்',
    colourSmokeFountain: 'வண்ண புகை நீரூற்று',
    matchesBox: 'தீப்பெட்டி பெட்டகம்',
    kannan5PieceGiftBox: 'கண்ணன் 5 துண்டு பரிசு பெட்டகம்',
    guns: 'துப்பாக்கிகள்',
    nattuVedi: 'நாட்டு வெடி',
    familyPack: 'குடும்ப பேக்',
    giftBox: 'பரிசு பெட்டகம்',
    
    // Category Page
    backToCategories: 'வகைகளுக்குத் திரும்பவும்',
    productsAvailable: 'தயாரிப்புகள் கிடைக்கின்றன',
    noProductsInCategory: 'இந்த வகையில் இன்னும் தயாரிப்புகள் எதுவும் கிடைக்கவில்லை.',
    browseOtherCategories: 'மற்ற வகைகளைப் பார்வையிடவும்',
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