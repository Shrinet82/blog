import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schema";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "ldjqfwev";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
  name: "default",
  title: "Lex Academia Studio",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
  document: {
    newDocumentOptions: (prev) => {
      return prev.filter((templateItem) => templateItem.templateId !== "category");
    },
    actions: (prev, context) => {
      if (context.schemaType === "category") {
        return prev.filter((originalAction) => originalAction.action !== "duplicate");
      }
      return prev;
    },
  },
});
