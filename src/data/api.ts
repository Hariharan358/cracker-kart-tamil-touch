export interface Product {
  _id: string;
  name_en: string;
  name_ta: string;
  price: number;
  imageUrl: string;
  category: string;
}

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  const res = await fetch(`https://km-crackers.onrender.com/api/products/category/${encodeURIComponent(category)}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch products for category: ${category}`);
  }

  const data = await res.json();
  return data;
};
