import { useEffect, useState } from "react";
import NoteCard from "./components/NoteCard";
import NoteForm from "./components/NoteForm";

function loadNotes() {
  try {
    const savedNotes = localStorage.getItem("notes");
    return savedNotes ? JSON.parse(savedNotes) : [];
  } catch {
    return [];
  }
}

function App() {
  const [notes, setNotes] = useState(loadNotes);
  const [editingNote, setEditingNote] = useState(null);
  const [showArchive, setShowArchive] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  // Load notes from localStorage when the component mounts
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  function addNote(newNote) {
    setNotes((previous) => [newNote, ...previous]);
  }

  function editNote(updatedNote) {
    setNotes((previous) =>
      previous.map((note) =>
        note.id === updatedNote.id ? updatedNote : note
      )
    );
  }

  function deleteNote(noteId) {
    setNotes((previous) =>
      previous.filter((note) => note.id !== noteId)
    );
    setSelectedIds((previous) =>
      previous.filter((id) => id !== noteId)
    );
  }
  function toggleArchive(noteId) {
    setNotes((previous) =>
      previous.map((note) =>
        note.id === noteId
          ? { ...note, archived: !note.archived }
          : note
      )
    );
  }
  // Function to toggle the pinned state of a note
  function togglePin(noteId) {
    setNotes((previous) =>
      previous.map((note) =>
        note.id === noteId
          ? { ...note, pinned: !note.pinned }
          : note
      )
    );
  }
  // Function to toggle the selection state of a note
  function toggleSelection(noteId) {
    setSelectedIds((previous) =>
      previous.includes(noteId)
        ? previous.filter((id) => id !== noteId)
        : [...previous, noteId]
    );
  }

  function deleteSelected() {
    if (
      selectedIds.length > 0 &&
      window.confirm(`Delete ${selectedIds.length} selected note(s)?`)
    ) {
      setNotes((previous) =>
        previous.filter((note) => !selectedIds.includes(note.id))
      );
      setSelectedIds([]);
    }
  }

  const visibleNotes = notes
    .filter((note) => showArchive ? note.archived : !note.archived)
    .filter((note) =>
      `${note.title} ${note.content}`
        .toLowerCase()
        .includes(search.toLowerCase().trim())
    )
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return Number(b.pinned) - Number(a.pinned);
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

  return (
    <main className="min-h-screen bg-stone-100 px-4 py-8 text-stone-800 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            My Notes
          </h1>

          <input
            type="search"
            placeholder="Search your notes..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-stone-500 sm:max-w-sm"
            aria-label="Search notes"
          />
        </header>

        <NoteForm
          addNote={addNote}
          editNote={editNote}
          editingNote={editingNote}
          cancelEdit={() => setEditingNote(null)}
          notes={notes}
        />

        <nav className="mb-6 flex items-center gap-3">
          <button
            onClick={() => {
              setShowArchive(false);
              setSelectedIds([]);
            }}
            className={`rounded-full px-5 py-2 ${
              !showArchive
                ? "bg-stone-800 text-white"
                : "bg-white hover:bg-stone-200"
            }`}
          >
            Notes
          </button>

          <button
            onClick={() => {
              setShowArchive(true);
              setSelectedIds([]);
            }}
            className={`rounded-full px-5 py-2 ${
              showArchive
                ? "bg-stone-800 text-white"
                : "bg-white hover:bg-stone-200"
            }`}
          >
            Archive
          </button>

          {selectedIds.length > 0 && (
            <button
              onClick={deleteSelected}
              className="ml-auto rounded-full bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Delete selected ({selectedIds.length})
            </button>
          )}
        </nav>

        {visibleNotes.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-lg font-medium text-stone-500">
              {search
                ? "No notes match your search."
                : showArchive
                  ? "Your archive is empty."
                  : "Your notes will appear here."}
            </p>
            {!search && !showArchive && (
              <p className="mt-2 text-sm text-stone-400">
                Write something in the box above to get started.
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                deleteNote={deleteNote}
                startEdit={setEditingNote}
                toggleArchive={toggleArchive}
                togglePin={togglePin}
                selected={selectedIds.includes(note.id)}
                toggleSelection={toggleSelection}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default App;