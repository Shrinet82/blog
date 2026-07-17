import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
  apiVersion: "2024-01-01",
});

const CORE_CATEGORIES = [
  { _id: "category-case-laws", title: "Case Laws", slug: "case-laws" },
  { _id: "category-current-affairs", title: "Current Affairs", slug: "current-affairs" },
  { _id: "category-general-studies", title: "General Studies", slug: "general-studies" },
];

async function recategorize() {
  console.log("Starting re-categorization...");

  // 1. Ensure core categories exist
  for (const cat of CORE_CATEGORIES) {
    await client.createIfNotExists({
      _id: cat._id,
      _type: "category",
      title: cat.title,
      slug: { current: cat.slug },
    });
  }

  // 2. Fetch all posts
  const posts = await client.fetch(`*[_type == "post"]{ _id, title, categories }`);
  console.log(`Found ${posts.length} posts to analyze.`);

  // 3. Assign to new categories
  let updatedCount = 0;
  for (const post of posts) {
    const title = post.title.toLowerCase();
    
    let newCategoryId = "category-current-affairs"; // Default
    
    if (title.includes(" v. ") || title.includes(" vs ") || title.includes(" vs. ") || title.includes("case") || title.includes("fir") || title.includes("c.b.i")) {
      newCategoryId = "category-case-laws";
    } else if (title.includes("scheme") || title.includes("mission") || title.includes("project") || title.includes("portal") || title.includes("dashboard") || title.includes("program")) {
      newCategoryId = "category-general-studies";
    }

    console.log(`[${newCategoryId}] ${post.title}`);

    await client.patch(post._id).set({
      categories: [{
        _type: "reference",
        _ref: newCategoryId,
        _key: newCategoryId
      }]
    }).commit();
    updatedCount++;
  }
  
  console.log(`Successfully updated ${updatedCount} posts.`);

  // 4. Delete old categories
  console.log("Cleaning up old unused categories...");
  const coreIds = CORE_CATEGORIES.map(c => c._id);
  const oldCategories = await client.fetch(`*[_type == "category" && !(_id in $coreIds)]{ _id, title }`, { coreIds });
  
  for (const oldCat of oldCategories) {
    console.log(`Deleting old category: ${oldCat.title} (${oldCat._id})`);
    try {
      await client.delete(oldCat._id);
    } catch(err: any) {
      console.log(`Could not delete ${oldCat._id}: ${err.message}`);
    }
  }

  console.log("Re-categorization Complete!");
}

recategorize().catch(console.error);
