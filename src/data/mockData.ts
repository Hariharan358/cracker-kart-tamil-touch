// Mock data for KM Crackers
// Category images
import sparklerImg from '../assets/categories/sparkler.jpg';
import flowerPotsImg from '../assets/image/flowerpot.jpg';
import chakkarsImg from '../assets/image/chakkaras.jpeg';
import fountainImg from '../assets/image/fountain.jpg';
import atomBombImg from '../assets/categories/atom-bomb.jpg';

export const categories = [
  "SPARKLER ITEMS",
  "FLOWER POTS",
  "CHAKKARS",
  "TWINKLING",
  "COLOUR FOUNTAIN WINDOW BIG",
  "Color Window Fountain 3 Inch",
  "ENJOY PENCIAL",
  "ONE SOUND CRACKERS",
  "BIJILI",
  "ROCKET BOMB",
  "ATOM BOMB",
  "GAINT & DELUXE",
  "RED MIRACLE (OTHER)",
  "RED MIRACLE (Brands)",
  "BABY FANCY NOVELTIES",
  "MULTI COLOUR SHOT BRAND",
  "MULTI COLOUR SHOT-Others",
  "COLOUR PAPER MUSICAL OUT",
  "MEGA DISPLAY SERIOUS",
  "MEGA FOUNTAIN",
  "MINI AERIAL CHOTTA FACNY",
  "MEGA DISPLAY",
  "GUJARATH FLOWER POTS",
  "NEW COLOUR FOUNTAIN SKY",
  "COLOUR SMOKE FOUNTAIN",
  "MATCHES BOX",
  "KANNAN 5 PIECE GIFT BOX",
  "GUNS",
  "NATTU VEDI"
];

// Category images mapping
export const categoryImages: Record<string, string> = {
  "SPARKLER ITEMS": sparklerImg,
  "FLOWER POTS": flowerPotsImg,
  "COLOUR FOUNTAIN WINDOW BIG": fountainImg,
  "Color Window Fountain 3 Inch": fountainImg,
  "CHAKKARS": chakkarsImg,
  "ATOM BOMB": atomBombImg,
  "GUJARATH FLOWER POTS": flowerPotsImg,
  // Add more mappings as needed, defaulting to sparkler for now
};

export interface Product {
  id: string;
  name_en: string;
  name_ta: string;
  price: number;
  image_url: string;
  category: string;
  youtube_url?: string; // Optional YouTube link
}

export const products: Product[] = [
  // ATOM BOMB Category
  {
    id: "prod_001",
    name_en: "Classic Atom Bomb",
    name_ta: "கிளாசிக் அடம் பாம்",
    price: 100,
    image_url: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=200&fit=crop",
    category: "ATOM BOMB",
    youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
  {
    id: "prod_002", 
    name_en: "Mega Atom Bomb",
    name_ta: "மெகா அடம் பாம்",
    price: 150,
    image_url: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=300&h=200&fit=crop",
    category: "ATOM BOMB"
  },
  {
    id: "prod_003",
    name_en: "Super Atom Bomb",
    name_ta: "சூப்பர் அடம் பாம்",
    price: 200,
    image_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&h=200&fit=crop",
    category: "ATOM BOMB",
    youtube_url: "https://www.youtube.com/watch?v=ysz5S6PUM-U"
  },

  // SPARKLER ITEMS Category
  {
    id: "prod_004",
    name_en: "Golden Sparkler",
    name_ta: "கோல்டன் ஸ்பார்க்லர்",
    price: 50,
    image_url: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=200&fit=crop",
    category: "SPARKLER ITEMS"
  },
  {
    id: "prod_005",
    name_en: "Color Sparkler Pack",
    name_ta: "கலர் ஸ்பார்க்லர் பேக்",
    price: 75,
    image_url: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=300&h=200&fit=crop",
    category: "SPARKLER ITEMS"
  },

  // FLOWER POTS Category
  {
    id: "prod_006",
    name_en: "Traditional Flower Pot",
    name_ta: "பாரம்பரிய மலர் பானை",
    price: 80,
    image_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&h=200&fit=crop",
    category: "FLOWER POTS"
  },
  {
    id: "prod_007",
    name_en: "Deluxe Flower Pot",
    name_ta: "டீலக்ஸ் மலர் பானை",
    price: 120,
    image_url: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=200&fit=crop",
    category: "FLOWER POTS"
  },

  // ROCKET BOMB Category
  {
    id: "prod_008",
    name_en: "Sky Rocket",
    name_ta: "ஸ்கை ராக்கெட்",
    price: 180,
    image_url: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=300&h=200&fit=crop",
    category: "ROCKET BOMB"
  },
  {
    id: "prod_009",
    name_en: "Thunder Rocket",
    name_ta: "தண்டர் ராக்கெட்",
    price: 220,
    image_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&h=200&fit=crop",
    category: "ROCKET BOMB"
  }
];

export const getCategoriesWithCount = () => {
  return categories.map(category => ({
    name: category,
    count: products.filter(product => product.category === category).length
  }));
};

export const getProductsByCategory = (category: string) => {
  return products.filter(product => product.category === category);
};