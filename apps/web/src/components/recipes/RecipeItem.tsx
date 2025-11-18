import Link from "next/link";
import DeleteRecipe from "./DeleteRecipe";

export interface RecipeProps {
  recipe: {
    title: string;
    _id: string;
    _creationTime: number;
    servings?: string;
    totalTime?: string;
  };
  deleteRecipe: any;
}

const RecipeItem = ({ recipe, deleteRecipe }: RecipeProps) => {
  return (
    <div className="flex justify-between items-center min-h-[74px] bg-[#F9FAFB] py-5 px-5 sm:px-11 gap-x-5 sm:gap-x-10">
      <Link href={`/recipes/${recipe._id}`} className="flex-1">
        <div>
          <h1 className="text-[#2D2D2D] text-[17px] sm:text-2xl not-italic font-normal leading-[114.3%] tracking-[-0.6px] mb-1">
            {recipe.title}
          </h1>
          {(recipe.servings || recipe.totalTime) && (
            <p className="text-gray-500 text-sm flex gap-3">
              {recipe.servings && <span>🍽️ {recipe.servings}</span>}
              {recipe.totalTime && <span>⏱️ {recipe.totalTime}</span>}
            </p>
          )}
        </div>
      </Link>
      <p className="hidden md:flex text-[#2D2D2D] text-center text-xl not-italic font-extralight leading-[114.3%] tracking-[-0.5px]">
        {new Date(Number(recipe._creationTime)).toLocaleDateString()}
      </p>
      <DeleteRecipe deleteAction={() => deleteRecipe({ recipeId: recipe._id })} />
    </div>
  );
};

export default RecipeItem;
