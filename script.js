const form = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const categorySelect = document.querySelector("#note-category");
const searchInput = document.querySelector("#search-input");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");
const clearAllBtn = document.querySelector("#clear-all");

// Load saved notes (or start with an empty array)
let notes = JSON.parse(localStorage.getItem("notes")) || [];

function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function render() {
  notesList.textContent = "";

  // Add validation count
  if (notes.length === 0) {
    noteCount.textContent = "You have no notes yet.";
  } else if (notes.length === 1) {
    noteCount.textContent = "You have 1 note.";
  } else {
    noteCount.textContent = "You have " + notes.length + " notes.";
  }

  // Add localStorage and search
  const search = searchInput.value.trim().toLowerCase();
  const visible = notes.filter(function (note) {
    return note.text.toLowerCase().includes(search);
  });

  if (notes.length > 0 && visible.length === 0) {
    const message = document.createElement("li");
    message.textContent = "No notes match your search.";
    notesList.appendChild(message);
  }

  // Build one card per note
  visible.forEach(function (note) {
    const li = document.createElement("li");
    li.classList.add("note", "category-" + note.category);

    const text = document.createElement("p");
    text.textContent = note.text;

    const label = document.createElement("span");
    label.classList.add("label");
    label.textContent = note.category.charAt(0).toUpperCase() + note.category.slice(1);

    const date = document.createElement("span");
    date.classList.add("date");
    date.textContent = note.createdAt;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", function () {
      notes = notes.filter(function (n) {
        return n.id !== note.id;
      });
      saveNotes();
      render();
    });

    li.append(text, label, date, deleteBtn);
    notesList.appendChild(li);
  });
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  const text = noteInput.value.trim();

  if (text === "") {
    errorMessage.textContent = "Please type a note first.";
    return;
  }
  if (text.length > 200) {
    errorMessage.textContent = "Notes must be 200 characters or fewer.";
    return;
  }

  notes.push({
    id: Date.now(),
    text: text,
    category: categorySelect.value,
    createdAt: new Date().toLocaleString(),
  });

  errorMessage.textContent = "";
  noteInput.value = "";
  saveNotes();
  render();
});

searchInput.addEventListener("input", render);

clearAllBtn.addEventListener("click", function () {
  if (confirm("Delete all notes?")) {
    notes = [];
    saveNotes();
    render();
  }
});

render();