"use client";

import { api } from "@packages/backend/convex/_generated/api";
import { Id } from "@packages/backend/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import ComplexToggle from "../home/ComplexToggle";
import { useState } from "react";
import Checkbox from "./Checkbox";

interface NoteDetailsProps {
  noteId: Id<"notes">;
}

const NoteDetails = ({ noteId }: NoteDetailsProps) => {
  const [isSummary, setIsSummary] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [regenerateSummary, setRegenerateSummary] = useState(false);

  const currentNote = useQuery(api.notes.getNote, { id: noteId });
  const updateNote = useMutation(api.notes.updateNote);

  const handleEdit = () => {
    setEditTitle(currentNote?.title || "");
    setEditContent(currentNote?.content || "");
    setRegenerateSummary(false);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!editTitle.trim() || !editContent.trim()) {
      alert("Title and content are required");
      return;
    }

    await updateNote({
      noteId,
      title: editTitle,
      content: editContent,
      isSummary: regenerateSummary,
    });

    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditTitle("");
    setEditContent("");
    setRegenerateSummary(false);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isEditing) {
    return (
      <div className="container space-y-6 py-20 px-[26px] sm:px-0">
        <h2 className="text-black text-center text-xl sm:text-[32px] not-italic font-semibold leading-[90.3%] tracking-[-0.8px]">
          Edit Note
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Content</label>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={12}
              className="w-full px-4 py-2 border rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
            />
          </div>
          <Checkbox
            label="Regenerate AI Summary"
            checked={regenerateSummary}
            setChecked={setRegenerateSummary}
          />
          <div className="flex gap-4 justify-center pt-4">
            <button
              onClick={handleCancel}
              className="px-6 py-2 border border-black rounded-md hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container space-y-6 sm:space-y-9 py-20 px-[26px] sm:px-0">
      <div className="flex justify-center items-center gap-4">
        <ComplexToggle isSummary={isSummary} setIsSummary={setIsSummary} />
        <button
          onClick={handleEdit}
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition text-sm"
        >
          Edit Note
        </button>
      </div>
      <h3 className="text-black text-center pb-5 text-xl sm:text-[32px] not-italic font-semibold leading-[90.3%] tracking-[-0.8px]">
        {currentNote?.title}
      </h3>
      {currentNote?.createdAt && (
        <div className="text-center text-sm text-gray-600 space-y-1">
          <p>Created: {formatDate(currentNote.createdAt)}</p>
          {currentNote.updatedAt !== currentNote.createdAt && (
            <p>Updated: {formatDate(currentNote.updatedAt)}</p>
          )}
        </div>
      )}
      <p className="text-black text-xl sm:text-[28px] not-italic font-normal leading-[130.3%] tracking-[-0.7px] whitespace-pre-wrap">
        {!isSummary
          ? currentNote?.content
          : currentNote?.summary
            ? currentNote?.summary
            : "No Summary available"}
      </p>
    </div>
  );
};

export default NoteDetails;
