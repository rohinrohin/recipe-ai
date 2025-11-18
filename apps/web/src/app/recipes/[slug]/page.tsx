import Header from "@/components/Header";
import RecipeDetails from "@/components/recipes/RecipeDetails";
import { Id } from "@packages/backend/convex/_generated/dataModel";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <main className="bg-[#F5F7FE] min-h-screen">
      <Header />
      <RecipeDetails recipeId={slug as Id<"recipes">} />
    </main>
  );
}
