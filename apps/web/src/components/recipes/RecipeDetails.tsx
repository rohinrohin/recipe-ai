"use client";

import { api } from "@packages/backend/convex/_generated/api";
import { Id } from "@packages/backend/convex/_generated/dataModel";
import { useQuery } from "convex/react";

interface RecipeDetailsProps {
  recipeId: Id<"recipes">;
}

const RecipeDetails = ({ recipeId }: RecipeDetailsProps) => {
  const currentRecipe = useQuery(api.recipes.getRecipe, { id: recipeId });

  if (!currentRecipe) {
    return (
      <div className="container py-20 px-[26px] sm:px-0">
        <p className="text-center text-gray-500">Loading recipe...</p>
      </div>
    );
  }

  return (
    <div className="container space-y-6 sm:space-y-9 py-20 px-[26px] sm:px-0 max-w-4xl">
      {/* Title */}
      <h1 className="text-black text-center pb-5 text-2xl sm:text-[40px] not-italic font-bold leading-[90.3%] tracking-[-0.8px]">
        {currentRecipe.title}
      </h1>

      {/* Description */}
      {currentRecipe.description && (
        <p className="text-gray-700 text-lg sm:text-xl italic text-center border-b pb-6">
          {currentRecipe.description}
        </p>
      )}

      {/* Meta Information */}
      <div className="flex flex-wrap justify-center gap-6 py-6 bg-white rounded-lg shadow-sm">
        {currentRecipe.servings && (
          <div className="flex flex-col items-center">
            <span className="text-3xl mb-2">🍽️</span>
            <span className="text-sm text-gray-500">Servings</span>
            <span className="text-lg font-semibold">{currentRecipe.servings}</span>
          </div>
        )}
        {currentRecipe.prepTime && (
          <div className="flex flex-col items-center">
            <span className="text-3xl mb-2">⏱️</span>
            <span className="text-sm text-gray-500">Prep Time</span>
            <span className="text-lg font-semibold">{currentRecipe.prepTime}</span>
          </div>
        )}
        {currentRecipe.cookTime && (
          <div className="flex flex-col items-center">
            <span className="text-3xl mb-2">🔥</span>
            <span className="text-sm text-gray-500">Cook Time</span>
            <span className="text-lg font-semibold">{currentRecipe.cookTime}</span>
          </div>
        )}
        {currentRecipe.totalTime && (
          <div className="flex flex-col items-center">
            <span className="text-3xl mb-2">⏰</span>
            <span className="text-sm text-gray-500">Total Time</span>
            <span className="text-lg font-semibold">{currentRecipe.totalTime}</span>
          </div>
        )}
      </div>

      {/* Tags and Categories */}
      {(currentRecipe.cuisine || currentRecipe.category || currentRecipe.tags) && (
        <div className="flex flex-wrap gap-3 justify-center py-4">
          {currentRecipe.cuisine && (
            <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {currentRecipe.cuisine}
            </span>
          )}
          {currentRecipe.category && (
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              {currentRecipe.category}
            </span>
          )}
          {currentRecipe.tags?.map((tag, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Ingredients */}
      <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
        <h2 className="text-black text-2xl sm:text-3xl not-italic font-bold leading-[90.3%] tracking-[-0.8px] mb-6 flex items-center gap-2">
          <span>🥘</span> Ingredients
        </h2>
        <ul className="space-y-3">
          {currentRecipe.ingredients.map((ingredient, index) => (
            <li
              key={index}
              className="flex items-start text-black text-lg sm:text-xl not-italic font-normal leading-[130.3%] tracking-[-0.5px]"
            >
              <span className="text-indigo-600 mr-3 font-bold">•</span>
              <span>
                {ingredient.amount && (
                  <strong className="text-gray-700">{ingredient.amount}</strong>
                )}{" "}
                {ingredient.item}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Instructions */}
      <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
        <h2 className="text-black text-2xl sm:text-3xl not-italic font-bold leading-[90.3%] tracking-[-0.8px] mb-6 flex items-center gap-2">
          <span>👨‍🍳</span> Instructions
        </h2>
        <ol className="space-y-5">
          {currentRecipe.instructions.map((instruction, index) => (
            <li
              key={index}
              className="flex items-start text-black text-lg sm:text-xl not-italic font-normal leading-[130.3%] tracking-[-0.5px]"
            >
              <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center mr-4 font-bold text-sm">
                {index + 1}
              </span>
              <span className="pt-1">{instruction}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Original Text (collapsed by default) */}
      {currentRecipe.originalText && (
        <details className="bg-gray-50 rounded-lg p-6">
          <summary className="cursor-pointer text-gray-700 font-semibold text-lg mb-2">
            View Original Text
          </summary>
          <pre className="text-gray-600 text-sm whitespace-pre-wrap mt-4 font-sans">
            {currentRecipe.originalText}
          </pre>
        </details>
      )}
    </div>
  );
};

export default RecipeDetails;
