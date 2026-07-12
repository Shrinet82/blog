import { defineField, defineType } from "sanity";

export default defineType({
  name: "book",
  title: "Book",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "author",
      title: "Author (Optional)",
      type: "string",
      description: "Leave blank if authored by you (ABHISHAL)",
    }),
    defineField({
      name: "publishDate",
      title: "Publish Date",
      type: "date",
    }),
    defineField({
      name: "description",
      title: "Description / Synopsis",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "purchaseLinks",
      title: "Purchase Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "platform",
              title: "Platform Name (e.g. Amazon, Flipkart, Notion Press)",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "url",
              title: "Link URL",
              type: "url",
              validation: (Rule) => Rule.required(),
            },
          ],
        },
      ],
      description: "Add links to where this book can be purchased.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "coverImage",
    },
  },
});
