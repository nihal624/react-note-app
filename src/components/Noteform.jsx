import { useEffect, useState } from "react";

const colors = [
  { name: "white", className: "bg-white", ring: "ring-stone-500" },
  { name: "yellow", className: "bg-yellow-100", ring: "ring-yellow-500" },
  { name: "green", className: "bg-green-100", ring: "ring-green-500" },
  { name: "blue", className: "bg-blue-100", ring: "ring-blue-500" },
  { name: "pink", className: "bg-pink-100", ring: "ring-pink-500" },
  { name: "purple", className: "bg-purple-100", ring: "ring-purple-500" }
];

function NoteForm({
  addNote,
  editNote,
  editingNote,
  cancelEdit,
  notes
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState("yellow");
  const [error, setError] = useState("");

  useEffect(() => {
    setTitle(editingNote?.title ?? "");
    setContent(editingNote?.content ?? "");
    setColor(editingNote?.color ?? "yellow");
    setError("");
  }, [editingNote]);

  function handleSubmit(event) {
    event.preventDefault();

    const cleanTitle = title.trim();
    const cleanContent = content.trim();

    if (!cleanContent) {
      setError("Please enter some note content.");
      return;
    }

    if (cleanTitle.length > 100) {
      setError("The title cannot exceed 100 characters.");
      return;
    }

    if (cleanContent.length > 5000) {
      setError("The content cannot exceed 5000 characters.");
      return;
    }

    const duplicate = notes.some((note) =>
      note.id !== editingNote?.id &&
      note.title.trim().toLowerCase() === cleanTitle.toLowerCase() &&
      note.content.trim().toLowerCase() === cleanContent.toLowerCase()
    );

    if (duplicate) {
      setError("This note already exists.");
      return;
    }

    const now = new Date().toISOString();

    if (editingNote) {
      editNote({
        ...editingNote,
        title: cleanTitle,
        content: cleanContent,
        color,
        updatedAt: now
      });
      cancelEdit();
    } else {
      addNote({
        id: crypto.randomUUID(),
        title: cleanTitle,
        content: cleanContent,
        color,
        createdAt: now,
        updatedAt: now,
        archived: false,
        pinned: false
      });
    }

    setTitle("");
    setContent("");
    setColor("yellow");
    setError("");
  }

  function handleKeyDown(event) {
    if (event.key === "Escape" && editingNote) {
      cancelEdit();
    }

    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      event.currentTarget.requestSubmit();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      className="mb-8 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6"
    >
      <input
        type="text"
        placeholder="Title"
        aria-label="Note title"
        value={title}
        maxLength={100}
        onChange={(event) => {
          setTitle(event.target.value);
          setError("");
        }}
        className="mb-1 w-full border-0 bg-transparent text-lg font-semibold outline-none placeholder:text-stone-400"
      />

      <div className="mb-3 text-right text-xs text-stone-400">
        {title.length}/100
      </div>

      <textarea
        placeholder="Write your note..."
        aria-label="Note content"
        value={content}
        maxLength={5000}
        rows={4}
        onChange={(event) => {
          setContent(event.target.value);
          setError("");
        }}
        className="w-full resize-y border-0 bg-transparent leading-7 outline-none placeholder:text-stone-400"
      />

      <div className="mb-4 text-right text-xs text-stone-400">
        {content.length}/5000
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-stone-100 pt-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-stone-500">Color</span>

          {colors.map((item) => (
            <button
              key={item.name}
              type="button"
              title={item.name}
              aria-label={`${item.name} note color`}
              aria-pressed={color === item.name}
              onClick={() => setColor(item.name)}
              className={`h-7 w-7 rounded-full border border-stone-300 ${item.className} ${
                color === item.name ? `ring-2 ${item.ring} ring-offset-2` : ""
              }`}
            />
          ))}
        </div>

        <div className="flex gap-2">
          {editingNote && (
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-full px-4 py-2 text-sm hover:bg-stone-100"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            className="rounded-full bg-stone-800 px-5 py-2 text-sm font-medium text-white hover:bg-stone-700"
          >
            {editingNote ? "Save changes" : "Add note"}
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}
    </form>
  );
}

export default NoteForm;