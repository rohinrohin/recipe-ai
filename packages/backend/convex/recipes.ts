import OpenAI from "openai";
import {
  internalAction,
  internalMutation,
  mutation,
  query,
} from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { getUserId } from "./utils";

// Get all recipes for the authenticated user
export const getRecipes = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    return await ctx.db
      .query("recipes")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
  },
});

// Get a specific recipe by ID
export const getRecipe = query({
  args: { id: v.id("recipes") },
  handler: async (ctx, { id }) => {
    const userId = await getUserId(ctx);
    const recipe = await ctx.db.get(id);

    if (!recipe || recipe.userId !== userId) {
      throw new Error("Recipe not found or unauthorized");
    }

    return recipe;
  },
});

// Create a recipe and schedule OpenAI parsing
export const createRecipe = mutation({
  args: {
    recipeText: v.string(),
  },
  handler: async (ctx, { recipeText }) => {
    const userId = await getUserId(ctx);

    // Create a placeholder recipe with status "parsing"
    const recipeId = await ctx.db.insert("recipes", {
      userId,
      title: "Parsing recipe...",
      ingredients: [],
      instructions: [],
      originalText: recipeText,
    });

    // Schedule the OpenAI parsing action
    await ctx.scheduler.runAfter(0, internal.recipes.parseRecipe, {
      id: recipeId,
      recipeText,
    });

    return recipeId;
  },
});

// Delete a recipe
export const deleteRecipe = mutation({
  args: { recipeId: v.id("recipes") },
  handler: async (ctx, { recipeId }) => {
    const userId = await getUserId(ctx);
    const recipe = await ctx.db.get(recipeId);

    if (!recipe || recipe.userId !== userId) {
      throw new Error("Recipe not found or unauthorized");
    }

    await ctx.db.delete(recipeId);
  },
});

// Internal action to parse recipe text using OpenAI
export const parseRecipe = internalAction({
  args: {
    id: v.id("recipes"),
    recipeText: v.string(),
  },
  handler: async (ctx, { id, recipeText }) => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("OPENAI_API_KEY is not set");
      await ctx.runMutation(internal.recipes.saveRecipeError, {
        id: id,
        error: "OpenAI API key is not configured",
      });
      return;
    }

    try {
      const openai = new OpenAI({ apiKey });

      const prompt = `Parse the following recipe text and extract structured information. Return a JSON object with these fields:
- title: string (recipe name)
- description: string (brief description, optional)
- ingredients: array of objects with {item: string, amount: string}
- instructions: array of strings (numbered steps)
- prepTime: string (e.g., "15 minutes", optional)
- cookTime: string (e.g., "30 minutes", optional)
- totalTime: string (e.g., "45 minutes", optional)
- servings: string (e.g., "4 servings", optional)
- cuisine: string (e.g., "Italian", optional)
- category: string (e.g., "Dinner", "Dessert", optional)
- tags: array of strings (e.g., ["vegetarian", "quick"], optional)

Recipe text:
${recipeText}`;

      const output = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant designed to parse recipes and output JSON. Extract as much information as possible from the recipe text. If a field is not found, omit it or use an empty array for array fields.",
          },
          { role: "user", content: prompt },
        ],
        model: "gpt-4-1106-preview",
        response_format: { type: "json_object" },
      });

      const messageContent = output.choices[0]?.message.content;
      if (!messageContent) {
        throw new Error("No response from OpenAI");
      }

      const parsedRecipe = JSON.parse(messageContent);
      console.log("Parsed recipe:", parsedRecipe);

      // Save the parsed recipe
      await ctx.runMutation(internal.recipes.saveRecipe, {
        id: id,
        recipe: parsedRecipe,
      });
    } catch (error) {
      console.error("Error parsing recipe:", error);
      await ctx.runMutation(internal.recipes.saveRecipeError, {
        id: id,
        error: error instanceof Error ? error.message : "Failed to parse recipe",
      });
    }
  },
});

// Internal mutation to save the parsed recipe
export const saveRecipe = internalMutation({
  args: {
    id: v.id("recipes"),
    recipe: v.object({
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
    }),
  },
  handler: async (ctx, { id, recipe }) => {
    await ctx.db.patch(id, {
      title: recipe.title,
      description: recipe.description,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      totalTime: recipe.totalTime,
      servings: recipe.servings,
      cuisine: recipe.cuisine,
      category: recipe.category,
      tags: recipe.tags,
    });
  },
});

// Internal mutation to save error state
export const saveRecipeError = internalMutation({
  args: {
    id: v.id("recipes"),
    error: v.string(),
  },
  handler: async (ctx, { id, error }) => {
    await ctx.db.patch(id, {
      title: "Failed to parse recipe",
      description: error,
      ingredients: [],
      instructions: [],
    });
  },
});
