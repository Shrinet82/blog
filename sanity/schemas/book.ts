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
      name: "amazonLink",
      title: "Amazon Link",
      type: "url",
      description: "Link to purchase on Amazon",
    }),
    defineField({
      name: "flipkartLink",
      title: "Flipkart Link",
      type: "url",
      description: "Link to purchase on Flipkart",
    }),
    defineField({
      name: "otherLink",
      title: "Other Purchase Link",
      type: "url",
      description: "Link to purchase on any other platform",
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "coverImage",
    },
  },
});
