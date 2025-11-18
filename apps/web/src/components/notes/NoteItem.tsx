import Link from "next/link";
import DeleteNote from "./DeleteNote";

export interface NoteProps {
  note: {
    title: string;
    _id: string;
    _creationTime: number;
    createdAt?: number;
    updatedAt?: number;
  };
  deleteNote: any;
}

const NoteItem = ({ note, deleteNote }: NoteProps) => {
  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const displayTime = note.updatedAt || note.createdAt || note._creationTime;
  const isUpdated =
    note.updatedAt && note.createdAt && note.updatedAt !== note.createdAt;

  return (
    <div className="flex justify-between items-center min-h-[74px] bg-[#F9FAFB] py-5 px-5 sm:px-11 gap-x-5 sm:gap-x-10">
      <Link href={`/notes/${note._id}`} className="flex-1">
        <h1 className=" text-[#2D2D2D] text-[17px] sm:text-2xl not-italic font-normal leading-[114.3%] tracking-[-0.6px]">
          {note.title}
        </h1>
      </Link>
      <div className="hidden md:flex flex-col items-end text-[#2D2D2D] text-sm sm:text-base not-italic font-extralight leading-tight">
        <p>{formatRelativeTime(displayTime)}</p>
        {isUpdated && (
          <p className="text-xs text-gray-500 italic">edited</p>
        )}
      </div>
      <DeleteNote deleteAction={() => deleteNote({ noteId: note._id })} />
    </div>
  );
};

export default NoteItem;
