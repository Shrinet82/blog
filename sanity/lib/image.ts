import imageUrlBuilder from "@sanity/image-url";
import { client } from "./client";

const builder = imageUrlBuilder(client);

export function urlForImage(source: any) {
  if (!source) return "";

  // If it's already a string (direct URL), return it
  if (typeof source === "string") return source;

  try {
    return builder.image(source).url();
  } catch (error) {
    console.warn("Could not build Sanity image URL, returning empty:", error);
    return "";
  }
}
