import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { basename } from "path";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
  apiVersion: "2023-01-01",
});

async function seed() {
  const filePath = "./sample.pdf";
  const fileBuffer = readFileSync(filePath);
  
  console.log("Uploading PDF...");
  const asset = await client.assets.upload('file', fileBuffer, {
    filename: basename(filePath)
  });

  console.log("Creating Journal Document...");
  const doc = await client.create({
    _type: "journal",
    title: "Test Journal: The Future of AI in Law",
    slug: { _type: "slug", current: "test-journal-ai-law" },
    publishDate: new Date().toISOString(),
    description: "This is a test journal uploaded automatically to demonstrate the Read Online and Download functionality of the new Journals section.",
    journalFile: {
      _type: "file",
      asset: {
        _type: "reference",
        _ref: asset._id
      }
    }
  });
  
  console.log("Success! Journal created:", doc._id);
}

seed().catch(console.error);
