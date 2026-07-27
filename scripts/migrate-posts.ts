import { createClient } from "next-sanity";
import * as fs from "fs";
import * as path from "path";

// Simple env loader since we are running a standalone script
const envLocal = fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8");
envLocal.split("\n").forEach((line) => {
  const match = line.match(/^([^=]+)="?(.*)"?$/);
  if (match) {
    // Remove quotes if present
    process.env[match[1]] = match[2].replace(/^"|"$/g, "");
  }
});

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

async function migrate() {
  console.log("Starting migration...");
  
  const posts = await client.fetch(`*[_type == "post"]{
    ...,
    "categorySlugs": categories[]->slug.current
  }`);

  console.log(`Found ${posts.length} posts to migrate.`);

  for (const post of posts) {
    const slugs = post.categorySlugs || [];
    
    // Determine the new type based on categories
    let newType = "generalStudies"; // Default fallback
    if (slugs.includes("current-affairs") || slugs.includes("daily-current-affairs")) {
      newType = "currentAffairs";
    } else if (slugs.includes("case-laws") || slugs.includes("constitutional-law") || slugs.includes("criminal-law")) {
      newType = "caseLaw";
    } else if (slugs.includes("general-studies") || slugs.includes("editorial")) {
      newType = "generalStudies";
    }

    // Extract Sanity system fields and fields we want to drop
    const { _id, _type, _rev, _createdAt, _updatedAt, categories, categorySlugs, ...restData } = post;
    
    // We prefix the old ID so it creates a brand new document safely without modifying the original
    const newId = `mig-${_id}`;
    
    const newDoc = {
      _id: newId,
      _type: newType,
      ...restData
    };

    console.log(`Migrating "${post.title}" (${slugs.join(", ")}) -> ${newType}`);
    
    try {
      await client.createIfNotExists(newDoc);
      console.log(`  -> Success: ${newId}`);
    } catch (err) {
      console.error(`  -> Failed to migrate ${newId}:`, err);
    }
  }
  
  console.log("Migration complete!");
}

migrate().catch(console.error);
