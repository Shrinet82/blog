import { defineField, defineType } from "sanity";

export default defineType({
  name: "actLaw",
  title: "Act & Law",
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
      name: "publishDate",
      title: "Publish Date",
      type: "date",
    }),
    defineField({
      name: "description",
      title: "Description / Abstract",
      type: "text",
      description: "A short summary shown on the acts and laws list page.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "body",
      title: "Full Synopsis / Article Body",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
        },
        { type: "image", options: { hotspot: true } },
      ],
      description: "The full text shown on the dedicated act/law page.",
    }),
    defineField({
      name: "actFile",
      title: "Act/Law PDF File",
      type: "file",
      options: {
        accept: "application/pdf",
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
  },
});
