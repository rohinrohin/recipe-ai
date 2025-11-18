"use client";

import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import { api } from "@packages/backend/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Id } from "@packages/backend/convex/_generated/dataModel";

export default function CreateRecipe() {
  const [open, setOpen] = useState(false);
  const [recipeText, setRecipeText] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [recipeId, setRecipeId] = useState<Id<"recipes"> | null>(null);

  const cancelButtonRef = useRef(null);

  const createRecipe = useMutation(api.recipes.createRecipe);
  const openaiKeySet = useQuery(api.openai.openaiKeySet) ?? true;

  // Poll the recipe to check if parsing is complete
  const recipe = useQuery(
    api.recipes.getRecipe,
    recipeId ? { id: recipeId } : "skip"
  );

  const createUserRecipe = async () => {
    if (!recipeText.trim()) return;

    setIsParsing(true);
    try {
      const id = await createRecipe({ recipeText });
      setRecipeId(id);
    } catch (error) {
      console.error("Error creating recipe:", error);
      setIsParsing(false);
    }
  };

  // Check if parsing is complete
  const parsingComplete =
    recipe &&
    recipe.title !== "Parsing recipe..." &&
    recipe.title !== "Failed to parse recipe";

  // Auto-close modal when parsing is complete
  if (parsingComplete && isParsing) {
    setTimeout(() => {
      setIsParsing(false);
      setRecipeText("");
      setRecipeId(null);
      setOpen(false);
    }, 1000);
  }

  return (
    <>
      <div className="flex justify-center items-center">
        <button
          onClick={() => setOpen(true)}
          className="button text-[#EBECEF] flex gap-4 justify-center items-center text-center px-8 sm:px-16 py-2"
        >
          <Image
            src={"/images/Add.png"}
            width={40}
            height={40}
            alt="add"
            className="float-right sm:w-[40px] sm:h-[40px] w-6 h-6"
          />
          <span className="text-[17px] sm:text-3xl not-italic font-medium leading-[79%] tracking-[-0.75px]">
            New Recipe
          </span>
        </button>
      </div>

      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={() => !isParsing && setOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-2 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-[10px] bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-[719px]">
                  {!isParsing ? (
                    <>
                      <div className="bg-white px-4 pb-4 pt-5 sm:p-8 sm:pb-4">
                        <div className="mt-3 sm:mt-0 text-left">
                          <Dialog.Title
                            as="h3"
                            className="text-black text-center text-xl sm:text-left sm:text-[35px] pb-6 sm:pb-8 not-italic font-semibold leading-[90.3%] tracking-[-0.875px]"
                          >
                            Create New Recipe
                          </Dialog.Title>
                          <div className="mt-2 space-y-3">
                            <div>
                              <label
                                htmlFor="recipe-text"
                                className="text-black text-[17px] sm:text-2xl not-italic font-medium leading-[90.3%] tracking-[-0.6px]"
                              >
                                Paste Recipe Text
                              </label>
                              <div className="mt-2 pb-[18px]">
                                <textarea
                                  id="recipe-text"
                                  name="recipe-text"
                                  rows={12}
                                  placeholder="Paste your recipe here... Include ingredients, instructions, cooking times, etc."
                                  className="block w-full rounded-md border-0 py-1.5 px-3 border-[#D0D5DD] text-2xl shadow-xs ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6 text-black text-[17px] not-italic font-light leading-[90.3%] tracking-[-0.425px] sm:text-2xl"
                                  value={recipeText}
                                  onChange={(e) => setRecipeText(e.target.value)}
                                />
                              </div>
                              {!openaiKeySet && (
                                <p className="text-red-600 text-sm mt-2">
                                  OpenAI API key is not configured. Please set it
                                  in your Convex dashboard.
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="px-4 py-3 mb-5 flex justify-center items-center gap-3">
                        <button
                          type="button"
                          className="px-8 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg text-[17px] sm:text-2xl not-italic font-semibold leading-[90.3%] tracking-[-0.6px]"
                          onClick={() => setOpen(false)}
                          ref={cancelButtonRef}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="button text-white text-center text-[17px] sm:text-2xl not-italic font-semibold leading-[90.3%] tracking-[-0.6px] px-[70px] py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={createUserRecipe}
                          disabled={!recipeText.trim() || !openaiKeySet}
                        >
                          Parse Recipe
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="bg-white px-4 pb-8 pt-5 sm:p-8">
                      <div className="flex flex-col items-center justify-center py-12">
                        <Dialog.Title
                          as="h3"
                          className="text-black text-center text-xl sm:text-[35px] pb-8 not-italic font-semibold leading-[90.3%] tracking-[-0.875px]"
                        >
                          {parsingComplete
                            ? "Recipe Parsed Successfully! ✨"
                            : "Parsing Your Recipe..."}
                        </Dialog.Title>

                        {!parsingComplete && (
                          <>
                            {/* Cooking pot animation */}
                            <div className="relative w-32 h-32 mb-6">
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-24 h-24 border-8 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
                              </div>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-4xl">🍳</span>
                              </div>
                            </div>

                            {/* Animated dots */}
                            <div className="flex gap-2 mb-4">
                              <div
                                className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce"
                                style={{ animationDelay: "0ms" }}
                              ></div>
                              <div
                                className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce"
                                style={{ animationDelay: "150ms" }}
                              ></div>
                              <div
                                className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce"
                                style={{ animationDelay: "300ms" }}
                              ></div>
                            </div>

                            <p className="text-gray-600 text-center text-[17px] sm:text-xl">
                              Our AI chef is analyzing your recipe...
                              <br />
                              <span className="text-sm text-gray-500">
                                This usually takes a few seconds
                              </span>
                            </p>
                          </>
                        )}

                        {parsingComplete && (
                          <div className="text-center">
                            <div className="text-6xl mb-4 animate-bounce">✅</div>
                            <p className="text-gray-600 text-[17px] sm:text-xl">
                              Your recipe has been saved!
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
