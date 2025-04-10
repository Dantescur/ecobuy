import productsData from "../../data/products.json";

interface Product {
    id: number
    title: string
    price: number
    description: string
    category: string
    image: string
    original_image?: string
    rating: {
      rate: number
      count: number
    }
  }

  export function getProducts(): Product[] {
    return productsData;
  }

  export function getProductById(id: number): Product | undefined {
    return productsData.find(product => product.id === id);
  }
