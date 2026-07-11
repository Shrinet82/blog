import { createClient } from "next-sanity";
import { MOCK_POSTS } from "../sanity/lib/mockData";
import * as fs from "fs";
import * as path from "path";

// Load .env.local manually
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  envContent.split("\n").forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || "";
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  });
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  console.error("Missing Sanity credentials in .env.local");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-07-10",
  useCdn: false,
  token,
});

async function seed() {
  console.log("Starting seeding process...");

  // 1. Extract and write unique authors
  const authorsMap = new Map<string, any>();
  const categoriesMap = new Map<string, any>();

  // Collect authors and categories from mock posts
  for (const post of MOCK_POSTS) {
    if (post.author) {
      authorsMap.set(post.author.slug.current, post.author);
    }
    if (post.categories) {
      for (const cat of post.categories) {
        categoriesMap.set(cat.slug.current, cat);
      }
    }
  }

  console.log(`Found ${authorsMap.size} authors and ${categoriesMap.size} categories.`);

  // Create/Update authors
  const seededAuthors = new Map<string, string>(); // slug -> _id
  for (const [slug, author] of Array.from(authorsMap.entries())) {
    const authorDoc = {
      _type: "author",
      _id: `author-${slug}`,
      name: author.name,
      slug: { _type: "slug", current: slug },
      role: author.role,
      bio: author.bio || "",
    };
    console.log(`Uploading author: ${author.name}...`);
    const result = await client.createOrReplace(authorDoc);
    seededAuthors.set(slug, result._id);
  }

  // Create/Update categories
  const seededCategories = new Map<string, string>(); // slug -> _id
  for (const [slug, cat] of Array.from(categoriesMap.entries())) {
    const categoryDoc = {
      _type: "category",
      _id: `category-${slug}`,
      title: cat.title,
      slug: { _type: "slug", current: slug },
      description: cat.description || "",
    };
    console.log(`Uploading category: ${cat.title}...`);
    const result = await client.createOrReplace(categoryDoc);
    seededCategories.set(slug, result._id);
  }

  // Create/Update posts
  for (const post of MOCK_POSTS) {
    const postSlug = post.slug.current;
    
    // Resolve author reference
    const authorRef = post.author ? {
      _type: "reference",
      _ref: seededAuthors.get(post.author.slug.current) || `author-${post.author.slug.current}`,
    } : undefined;

    // Resolve category references
    const categoryRefs = post.categories ? post.categories.map((cat) => ({
      _type: "reference",
      _ref: seededCategories.get(cat.slug.current) || `category-${cat.slug.current}`,
      _key: `ref-${cat.slug.current}`,
    })) : [];

    // Map main image if exists
    let mainImageDoc = undefined;
    if (post.mainImage) {
      const ref = post.mainImage.asset?._ref;
      let realRef = ref;
      if (ref && (ref === "image-mock-1" || ref.includes("mock"))) {
        const imageUrl = ref === "image-mock-1" 
          ? "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=1200"
          : "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?auto=format&fit=crop&q=80&w=1200";
        try {
          console.log(`Uploading asset image from URL for ${ref}...`);
          const response = await fetch(imageUrl);
          const arrayBuffer = await response.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const asset = await client.assets.upload("image", buffer, {
            filename: `${ref}.jpg`
          });
          realRef = asset._id;
          console.log(`Successfully uploaded image! New Ref: ${realRef}`);
        } catch (err) {
          console.warn("Failed to upload image asset to Sanity, omitting image:", err);
          realRef = undefined;
        }
      }
      
      if (realRef) {
        mainImageDoc = {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: realRef,
          },
        };
      }
    }

    const postDoc = {
      _type: "post",
      _id: `post-${postSlug}`,
      title: post.title,
      slug: { _type: "slug", current: postSlug },
      excerpt: post.excerpt || "",
      publishedAt: post.publishedAt,
      isLandmark: !!post.isLandmark,
      author: authorRef,
      categories: categoryRefs,
      mainImage: mainImageDoc,
      body: post.body || [],
    };

    console.log(`Uploading post: ${post.title}...`);
    await client.createOrReplace(postDoc);
  }

  console.log("Seeding completed successfully!");
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
