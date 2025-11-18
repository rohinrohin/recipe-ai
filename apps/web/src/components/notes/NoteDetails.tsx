"use client";

import { api } from "@packages/backend/convex/_generated/api";
import { Id } from "@packages/backend/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import ComplexToggle from "../home/ComplexToggle";
import { useState } from "react";

interface NoteDetailsProps {
  noteId: Id<"notes">;
}

const NoteDetails = ({ noteId }: NoteDetailsProps) => {
  const [isSummary, setIsSummary] = useState(false);
  const currentNote = useQuery(api.notes.getNote, { id: noteId });

  return (
    <div className="container mx-auto max-w-[900px] space-y-8 sm:space-y-10 py-16 sm:py-24 px-6 sm:px-12">
      <div className="flex justify-center items-center mb-6">
        <ComplexToggle isSummary={isSummary} setIsSummary={setIsSummary} />
      </div>
      <div className="bg-white rounded-2xl p-8 sm:p-12 border-2 border-[#E9DBCD] shadow-lg">
        <h1 className="text-[#1A0803] font-[family-name:var(--font-pangram)] text-center text-2xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight pb-8 sm:pb-10">
          {currentNote?.title}
        </h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-[#2C2726] font-[family-name:var(--font-inter)] text-lg sm:text-xl font-normal leading-relaxed whitespace-pre-wrap">
            {!isSummary
              ? currentNote?.content
              : currentNote?.summary
                ? currentNote?.summary
                : "No AI summary available for this recipe"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoteDetails;
