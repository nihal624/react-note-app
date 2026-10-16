function NoteCard({
  note,
  deleteNote,
  startEdit,
  toggleArchive,
  togglePin,
  selected,
  toggleSelection
}) {
  const colorClasses = {
    white: "bg-white",
    yellow: "bg-yellow-100",
    green: "bg-green-100",
    blue: "bg-blue-100",
    pink: "bg-pink-100",
    purple: "bg-purple-100"
  };

  function formatDate(value) {
    if (!value) return "";
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? ""
      : date.toLocaleDateString();
  }

  function handleDelete() {
    if (window.confirm("Delete this note permanently?")) {
      deleteNote(note.id);
    }
  }

  return (
    <article
      className={`flex min-h-48 flex-col rounded-2xl border border-stone-200 p-4 shadow-sm transition hover:shadow-md ${
        colorClasses[note.color] || "bg-white"
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selected}
            onChange={() => toggleSelection(note.id)}
            aria-label={`Select ${note.title || "untitled note"}`}
          />
          <span className="text-xs text-stone-500">Select</span>
        </label>

        <button
          type="button"
          onClick={() => togglePin(note.id)}
          title={note.pinned ? "Unpin note" : "Pin note"}
          aria-label={note.pinned ? "Unpin note" : "Pin note"}
          className="rounded-full px-2 py-1 text-lg hover:bg-black/5"
        >
          {note.pinned ? "📌" : "○"}
        </button>
      </div>

      {note.title && (
        <h2 className="mb-2 break-words text-lg font-semibold">
          {note.title}
        </h2>
      )}

      <p className="flex-1 whitespace-pre-wrap break-words leading-6">
        {note.content}
      </p>

      <div className="mt-4 border-t border-black/10 pt-3">
        <p className="mb-3 text-xs text-stone-500">
          Updated {formatDate(note.updatedAt || note.createdAt)}
        </p>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => startEdit(note)}
            className="rounded-full px-3 py-1.5 text-sm hover:bg-black/5"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => toggleArchive(note.id)}
            className="rounded-full px-3 py-1.5 text-sm hover:bg-black/5"
          >
            {note.archived ? "Restore" : "Archive"}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="rounded-full px-3 py-1.5 text-sm text-red-700 hover:bg-red-100"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

export default NoteCard;