import { Post, Book, Journal } from "./types";

export const getPostsQuery = `*[_type in ["currentAffairs", "caseLaw", "generalStudies"]] | order(publishedAt desc) {
  _id,
  _type,
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
  "categories": select(
    _type == "currentAffairs" => [{"title": "Current Affairs", "slug": {"current": "current-affairs"}}],
    _type == "caseLaw" => [{"title": "Case Laws", "slug": {"current": "case-laws"}}],
    _type == "generalStudies" => [{"title": "General Studies", "slug": {"current": "general-studies"}}],
    categories[]-> { title, slug }
  )
}`;

export const getPostBySlugQuery = `*[_type in ["currentAffairs", "caseLaw", "generalStudies"] && slug.current == $slug][0] {
  _id,
  _type,
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
  "categories": select(
    _type == "currentAffairs" => [{"title": "Current Affairs", "slug": {"current": "current-affairs"}}],
    _type == "caseLaw" => [{"title": "Case Laws", "slug": {"current": "case-laws"}}],
    _type == "generalStudies" => [{"title": "General Studies", "slug": {"current": "general-studies"}}],
    categories[]-> { title, slug }
  )
}`;

export const getPostsByCategoryQuery = `*[
  (
    (_type == "currentAffairs" && ($categorySlug in ["current-affairs", "daily-current-affairs"])) ||
    (_type == "caseLaw" && ($categorySlug in ["case-laws", "constitutional-law", "criminal-law"])) ||
    (_type == "generalStudies" && ($categorySlug in ["general-studies", "editorial"]))
  )
] | order(publishedAt desc) {
  _id,
  _type,
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
  "categories": select(
    _type == "currentAffairs" => [{"title": "Current Affairs", "slug": {"current": "current-affairs"}}],
    _type == "caseLaw" => [{"title": "Case Laws", "slug": {"current": "case-laws"}}],
    _type == "generalStudies" => [{"title": "General Studies", "slug": {"current": "general-studies"}}],
    categories[]-> { title, slug }
  )
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

export const getJournalBySlugQuery = `*[_type == "journal" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  publishDate,
  description,
  body,
  "journalFileUrl": journalFile.asset->url
}`;

export const getActsLawsQuery = `*[_type == "actLaw"] | order(publishDate desc) {
  _id,
  title,
  slug,
  publishDate,
  description,
  "actFileUrl": actFile.asset->url
}`;

export const getActLawBySlugQuery = `*[_type == "actLaw" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  publishDate,
  description,
  body,
  "actFileUrl": actFile.asset->url
}`;
