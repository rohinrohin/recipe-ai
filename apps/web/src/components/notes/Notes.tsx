"use client";

import { api } from "@packages/backend/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import Image from "next/image";
import { useState } from "react";
import CreateNote from "./CreateNote";
import NoteItem from "./NoteItem";

const Notes = () => {
  const [search, setSearch] = useState("");

  const allNotes = useQuery(api.notes.getNotes);
  const deleteNote = useMutation(api.notes.deleteNote);

  const finalNotes = search
    ? allNotes?.filter(
        (note) =>
          note.title.toLowerCase().includes(search.toLowerCase()) ||
          note.content.toLowerCase().includes(search.toLowerCase()),
      )
    : allNotes;

  return (
    <div className="container mx-auto pb-10 px-6 sm:px-12 max-w-[1280px]">
      <h1 className="text-[#1A0803] font-[family-name:var(--font-pangram)] text-center text-[28px] sm:text-[48px] font-bold leading-tight tracking-tight sm:mt-12 my-6 sm:mb-12">
        Your Recipes
      </h1>
      <div className="px-0 mb-8">
        <div className="bg-white flex items-center h-[48px] sm:h-[60px] rounded-xl border-2 border-[#E9DBCD] gap-3 sm:gap-4 px-4 sm:px-6 focus-within:border-[#F64C20] transition-colors">
          <Image
            src={"/images/search.svg"}
            width={20}
            height={20}
            alt="search"
            className="cursor-pointer opacity-60"
          />
          <input
            type="text"
            placeholder="Search recipes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-[#1A0803] font-[family-name:var(--font-inter)] text-base sm:text-lg font-normal placeholder:text-[#7F7876] focus:outline-0 focus:ring-0 focus:border-0 border-0"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-20">
        {finalNotes &&
          finalNotes.map((note, index) => (
            <NoteItem key={index} note={note} deleteNote={deleteNote} />
          ))}
      </div>

      <CreateNote />
    </div>
  );
};

export default Notes;
