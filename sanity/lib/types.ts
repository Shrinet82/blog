export interface Author {
  name: string;
  slug: { current: string };
  image?: any;
  bio?: string;
  role: string;
}

export interface Category {
  title: string;
  slug: { current: string };
  description?: string;
}

export interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  author: Author;
  mainImage?: any;
  categories?: Category[];
  publishedAt: string;
  excerpt?: string;
  body: any;
  isLandmark?: boolean;
}
