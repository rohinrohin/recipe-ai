"use client";

import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import Checkbox from "./Checkbox";
import { api } from "@packages/backend/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";

export default function CreateNote() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const cancelButtonRef = useRef(null);

  const createNote = useMutation(api.notes.createNote);
  const openaiKeySet = useQuery(api.openai.openaiKeySet) ?? true;

  const createUserNote = async () => {
    await createNote({
      title,
      content,
      isSummary: isChecked,
    });
    setOpen(false);
  };

  return (
    <>
      <div className="flex justify-center items-center">
        <button
          onClick={() => setOpen(true)}
          className="button flex gap-3 justify-center items-center text-center px-10 sm:px-16 py-4 font-[family-name:var(--font-pangram)] text-lg sm:text-2xl"
        >
          <Image
            src={"/images/Add.png"}
            width={32}
            height={32}
            alt="Add recipe"
            className="sm:w-[32px] sm:h-[32px] w-6 h-6 brightness-0"
          />
          <span>New Recipe</span>
        </button>
      </div>

      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setOpen}
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

          <form className="fixed inset-0 z-10 w-screen overflow-y-auto">
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
                <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-[719px]">
                  <div className="bg-white px-6 pb-6 pt-8 sm:p-10 sm:pb-6">
                    <>
                      <div className="mt-3 sm:mt-0 text-left">
                        <Dialog.Title
                          as="h2"
                          className="text-[#1A0803] font-[family-name:var(--font-pangram)] text-center text-2xl sm:text-left sm:text-4xl pb-6 sm:pb-8 font-bold leading-tight"
                        >
                          Create New Recipe
                        </Dialog.Title>
                        <div className="mt-2 space-y-5">
                          <div>
                            <label
                              htmlFor="title"
                              className="text-[#1A0803] font-[family-name:var(--font-pangram)] text-base sm:text-lg font-semibold mb-2 block"
                            >
                              Recipe Title
                            </label>
                            <input
                              id="title"
                              name="title"
                              type="text"
                              placeholder="e.g., Grandma's Chocolate Chip Cookies"
                              autoComplete="title"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              className="border-2 rounded-xl border-[#E9DBCD] bg-white w-full py-3 px-4 text-[#1A0803] font-[family-name:var(--font-inter)] text-base sm:text-lg placeholder:text-[#7F7876] focus:outline-none focus:border-[#F64C20] transition-colors"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="description"
                              className="text-[#1A0803] font-[family-name:var(--font-pangram)] text-base sm:text-lg font-semibold mb-2 block"
                            >
                              Recipe Details
                            </label>
                            <textarea
                              id="description"
                              name="description"
                              rows={8}
                              placeholder="Add ingredients, instructions, and cooking notes..."
                              className="block w-full rounded-xl border-2 border-[#E9DBCD] py-3 px-4 text-[#1A0803] font-[family-name:var(--font-inter)] text-base sm:text-lg placeholder:text-[#7F7876] focus:outline-none focus:border-[#F64C20] transition-colors resize-none"
                              value={content}
                              onChange={(e) => setContent(e.target.value)}
                            />
                          </div>

                          <div className="pt-2">
                            <p className="text-[#1A0803] font-[family-name:var(--font-pangram)] text-base sm:text-lg font-semibold mb-3">
                              AI Features
                            </p>
                            <Checkbox
                              openaiKeySet={openaiKeySet}
                              isChecked={isChecked}
                              checkHandler={() => setIsChecked(!isChecked)}
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  </div>
                  <div className="px-6 py-4 mb-6 flex justify-center items-center">
                    <button
                      type="button"
                      className="button font-[family-name:var(--font-pangram)] text-base sm:text-xl px-16 py-3"
                      onClick={createUserNote}
                    >
                      Create Recipe
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </form>
        </Dialog>
      </Transition.Root>
    </>
  );
}
