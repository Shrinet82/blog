import { createClient } from "next-sanity";
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

if (!projectId || !dataset) {
  console.error("Missing Sanity credentials in .env.local");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-07-10",
  useCdn: false,
});

async function verify() {
  console.log("Testing live client query on Sanity dataset...");
  const posts = await client.fetch(`*[_type == "post"] { _id, title, "authorName": author->name }`);
  console.log(`Successfully fetched ${posts.length} posts from live Sanity:`);
  console.log(JSON.stringify(posts, null, 2));
}

verify().catch(err => {
  console.error("Verification failed:", err);
  process.exit(1);
});
