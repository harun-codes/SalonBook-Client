
export interface Service {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  status: string;
}

export type ServiceSortOption =
  | "default"
  | "price-low-high"
  | "price-high-low";
