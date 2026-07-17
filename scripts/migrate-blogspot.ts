import { createClient } from "@sanity/client";
import { JSDOM } from "jsdom";
import { htmlToBlocks } from "@sanity/block-tools";
import { Schema } from "@sanity/schema";

// The schema is required for block-tools to know how to structure the blocks
const defaultSchema = Schema.compile({
  name: "myBlog",
  types: [
    {
      type: "object",
      name: "blogPost",
      fields: [
        {
          title: "Body",
          name: "body",
          type: "array",
          of: [{ type: "block" }],
        },
      ],
    },
  ],
});
const blockContentType = defaultSchema
  .get("blogPost")
  .fields.find((field: any) => field.name === "body").type;

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
  apiVersion: "2024-01-01",
});

const BLOGSPOT_JSON_URL =
  "https://abhishalcurrentlawgs.blogspot.com/feeds/posts/default?alt=json&max-results=50";

async function migrate() {
  console.log("Starting migration...");

  // 1. Fetch Blogspot posts
  console.log("Fetching posts from Blogspot...");
  const res = await fetch(BLOGSPOT_JSON_URL);
  const data = await res.json();
  const entries = data.feed.entry || [];
  console.log(`Found ${entries.length} posts.`);

  // 2. Create the Author
  console.log("Ensuring Author 'Abhishal Prakashan' exists...");
  const authorId = "author-abhishal";
  await client.createIfNotExists({
    _id: authorId,
    _type: "author",
    name: "Abhishal Prakashan",
    role: "Editor-in-Chief",
  });

  // 3. Process each post
  for (const entry of entries) {
    const title = entry.title.$t;
    const publishedAt = entry.published.$t;
    const htmlContent = entry.content ? entry.content.$t : "";
    const labels = entry.category ? entry.category.map((c: any) => c.term) : [];
    
    console.log(`Processing: "${title}"`);

    // Create Categories
    const categoryRefs = [];
    for (const label of labels) {
      const slugified = label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const catId = `category-${slugified}`;
      await client.createIfNotExists({
        _id: catId,
        _type: "category",
        title: label,
        slug: { current: slugified },
      });
      categoryRefs.push({
        _type: "reference",
        _ref: catId,
        _key: catId,
      });
    }

    // Convert HTML to Portable Text blocks
    let portableTextBlocks = [];
    if (htmlContent) {
      portableTextBlocks = htmlToBlocks(htmlContent, blockContentType, {
        parseHtml: (html) => new JSDOM(html).window.document,
      });
    }
    
    // Fallback if blocks fail
    if (!portableTextBlocks || portableTextBlocks.length === 0) {
      portableTextBlocks = [
        {
          _type: "block",
          children: [
            {
              _type: "span",
              text: "Content could not be parsed.",
            },
          ],
        },
      ];
    }

    // Slugify title
    let slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    if (!slug) slug = `post-${Date.now()}`;

    // Create Post in Sanity
    const doc = {
      _type: "post",
      title: title,
      slug: { current: slug },
      author: { _type: "reference", _ref: authorId },
      publishedAt: publishedAt,
      body: portableTextBlocks,
      categories: categoryRefs,
      isLandmark: false,
    };

    try {
      await client.create(doc);
      console.log(` -> Uploaded!`);
    } catch (err: any) {
      if (err.message && err.message.includes("is already in use")) {
         console.log(` -> Skipped (already exists)`);
      } else {
         console.error(` -> Error uploading ${title}:`, err.message);
      }
    }
  }

  console.log("Migration Complete!");
}

migrate().catch(console.error);
