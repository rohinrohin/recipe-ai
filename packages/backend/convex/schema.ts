import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  notes: defineTable({
    userId: v.string(),
    title: v.string(),
    content: v.string(),
    summary: v.optional(v.string()),
  }),
  recipes: defineTable({
    userId: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    ingredients: v.array(
      v.object({
        item: v.string(),
        amount: v.optional(v.string()),
      })
    ),
    instructions: v.array(v.string()),
    prepTime: v.optional(v.string()),
    cookTime: v.optional(v.string()),
    totalTime: v.optional(v.string()),
    servings: v.optional(v.string()),
    cuisine: v.optional(v.string()),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    originalText: v.string(), // Store the original text for reference
  }),
});
