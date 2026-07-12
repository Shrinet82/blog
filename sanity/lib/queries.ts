import { Post, Book, Journal } from "./types";

export const getPostsQuery = `*[_type == "post"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  isLandmark,
  mainImage,
  author-> {
    name,
    role,
    image
  },
  categories[]-> {
    title,
    slug
  }
}`;

export const getPostBySlugQuery = `*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  isLandmark,
  mainImage,
  body,
  author-> {
    name,
    role,
    bio,
    image
  },
  categories[]-> {
    title,
    slug
  }
}`;

export const getPostsByCategoryQuery = `*[_type == "post" && references(*[_type == "category" && slug.current == $categorySlug]._id)] | order(publishedAt desc) {
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  isLandmark,
  mainImage,
  author-> {
    name,
    role,
    image
  },
  categories[]-> {
    title,
    slug
  }
}`;

export const getBooksQuery = `*[_type == "book"] | order(publishDate desc) {
  _id,
  title,
  slug,
  coverImage,
  author,
  publishDate,
  description,
  purchaseLinks
}`;

export const getJournalsQuery = `*[_type == "journal"] | order(publishDate desc) {
  _id,
  title,
  slug,
  publishDate,
  description,
  "journalFileUrl": journalFile.asset->url
}`;
