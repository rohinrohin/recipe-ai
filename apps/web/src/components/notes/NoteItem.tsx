import Link from "next/link";
import DeleteNote from "./DeleteNote";

export interface NoteProps {
  note: {
    title: string;
    _id: string;
    _creationTime: number;
  };
  deleteNote: any;
}

const NoteItem = ({ note, deleteNote }: NoteProps) => {
  return (
    <div className="group flex flex-col bg-white rounded-xl p-6 border-2 border-[#E9DBCD] hover:border-[#F64C20] transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <Link href={`/notes/${note._id}`} className="flex-1 mb-4">
        <h2 className="text-[#1A0803] font-[family-name:var(--font-pangram)] text-lg sm:text-xl font-bold leading-tight mb-2 line-clamp-2 group-hover:text-[#F64C20] transition-colors">
          {note.title}
        </h2>
        <p className="text-[#7F7876] font-[family-name:var(--font-inter)] text-sm font-normal">
          {new Date(Number(note._creationTime)).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
        </p>
      </Link>
      <div className="flex justify-end pt-3 border-t border-[#E9DBCD]">
        <DeleteNote deleteAction={() => deleteNote({ noteId: note._id })} />
      </div>
    </div>
  );
};

export default NoteItem;
