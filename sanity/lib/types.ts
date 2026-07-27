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

export interface CurrentAffairs extends Omit<Post, 'categories'> {}
export interface CaseLaw extends Omit<Post, 'categories'> {}
export interface GeneralStudies extends Omit<Post, 'categories'> {}

export interface Book {
  _id: string;
  title: string;
  slug: { current: string };
  coverImage?: any;
  author?: string;
  publishDate?: string;
  description: string;
  purchaseLinks?: {
    platform: string;
    url: string;
  }[];
}

export interface Journal {
  _id: string;
  title: string;
  slug: { current: string };
  publishDate?: string;
  description: string;
  body?: any;
  journalFileUrl?: string;
}

export interface ActLaw {
  _id: string;
  title: string;
  slug: { current: string };
  publishDate?: string;
  description: string;
  body?: any;
  actFileUrl?: string;
}
