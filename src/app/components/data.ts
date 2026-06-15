export type ProductStatus = "Normal" | "Baixo" | "Zerado";

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  minStock: number;
  description: string;
}

export interface StockMovement {
  id: number;
  productId: number;
  productName: string;
  type: "Entrada" | "Saída";
  quantity: number;
  observation: string;
  date: string;
}

export const CATEGORIES = [
  "Eletrônicos",
  "Alimentos",
  "Vestuário",
  "Ferramentas",
  "Higiene",
  "Escritório",
  "Outros",
];

export function getStatus(product: Product): ProductStatus {
  if (product.quantity === 0) return "Zerado";
  if (product.quantity <= product.minStock) return "Baixo";
  return "Normal";
}
