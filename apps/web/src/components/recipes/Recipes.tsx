"use client";

import { api } from "@packages/backend/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import Image from "next/image";
import { useState } from "react";
import CreateRecipe from "./CreateRecipe";
import RecipeItem from "./RecipeItem";

const Recipes = () => {
  const [search, setSearch] = useState("");

  const allRecipes = useQuery(api.recipes.getRecipes);
  const deleteRecipe = useMutation(api.recipes.deleteRecipe);

  const finalRecipes = search
    ? allRecipes?.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(search.toLowerCase()) ||
          recipe.description?.toLowerCase().includes(search.toLowerCase()) ||
          recipe.tags?.some((tag) =>
            tag.toLowerCase().includes(search.toLowerCase())
          )
      )
    : allRecipes;

  return (
    <div className="container pb-10">
      <h1 className="text-[#2D2D2D] text-center text-[20px] sm:text-[43px] not-italic font-normal sm:font-medium leading-[114.3%] tracking-[-1.075px] sm:mt-8 my-4 sm:mb-10">
        Your Recipes
      </h1>
      <div className="px-5 sm:px-0">
        <div className="bg-white flex items-center h-[39px] sm:h-[55px] rounded-sm border border-solid gap-2 sm:gap-5 mb-10 border-[rgba(0,0,0,0.40)] px-3 sm:px-11">
          <Image
            src={"/images/search.svg"}
            width={23}
            height={22}
            alt="search"
            className="cursor-pointer sm:w-[23px] sm:h-[22px] w-[20px] h-[20px]"
          />
          <input
            type="text"
            placeholder="Search recipes by title, description, or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-[#2D2D2D] text-[17px] sm:text-2xl not-italic font-light leading-[114.3%] tracking-[-0.6px] focus:outline-0 focus:ring-0 focus:border-0 border-0"
          />
        </div>
      </div>

      <div className="border-[0.5px] mb-20 divide-y-[0.5px] divide-[#00000096] border-[#00000096]">
        {finalRecipes && finalRecipes.length > 0 ? (
          finalRecipes.map((recipe, index) => (
            <RecipeItem key={index} recipe={recipe} deleteRecipe={deleteRecipe} />
          ))
        ) : (
          <div className="bg-[#F9FAFB] py-12 text-center">
            <p className="text-gray-500 text-lg">
              {search
                ? "No recipes found matching your search"
                : "No recipes yet. Create your first recipe!"}
            </p>
          </div>
        )}
      </div>

      <CreateRecipe />
    </div>
  );
};

export default Recipes;
