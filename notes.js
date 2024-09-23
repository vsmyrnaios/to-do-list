const container = document.querySelector(".container");

// Function to create a new sticky note
function createStickyNote(text = "", isFirst = false) {
  const newStickyNote = document.createElement("div");
  newStickyNote.className = "sticky-note";

  const textarea = document.createElement("textarea");
  textarea.placeholder = "Write your note here...";
  textarea.value = text; // Ρυθμίστε το περιεχόμενο αν παρέχεται
  newStickyNote.appendChild(textarea);

  if (!isFirst) {
    // Προσθήκη κουμπιού κλεισίματος μόνο αν δεν είναι το πρώτο sticky note
    const closeButton = document.createElement("button");
    closeButton.className = "close-button";
    closeButton.textContent = "×";
    closeButton.addEventListener("click", function () {
      newStickyNote.remove();
      saveStickyNotes(); // Αποθήκευση όταν αφαιρείται ένα sticky note
      ensureAtLeastOneNote(); // Διασφαλίστε ότι υπάρχει τουλάχιστον ένα sticky note
      showAddButton(); // Εμφάνιση κουμπιού προσθήκης στο τελευταίο sticky note
    });
    newStickyNote.appendChild(closeButton);
  }

  // Προσθήκη event listener για την αλλαγή περιεχομένου
  textarea.addEventListener("input", function () {
    saveStickyNotes(); // Αποθήκευση όταν αλλάζει το περιεχόμενο
  });

  return newStickyNote;
}

// Function to save sticky notes to localStorage
function saveStickyNotes() {
  const notes = [];
  container.querySelectorAll(".sticky-note").forEach(function (note) {
    notes.push({
      text: note.querySelector("textarea").value,
    });
  });
  localStorage.setItem("stickyNotes", JSON.stringify(notes));
}

// Function to load sticky notes from localStorage
function loadStickyNotes() {
  const savedNotes = localStorage.getItem("stickyNotes");
  if (savedNotes) {
    const notesData = JSON.parse(savedNotes);
    // Καθαρισμός του container πριν την ανακατασκευή
    container.innerHTML = "";
    notesData.forEach(function (noteData, index) {
      const isFirst = index === 0; // Το πρώτο sticky note δεν μπορεί να διαγραφεί
      const newStickyNote = createStickyNote(noteData.text, isFirst);
      container.appendChild(newStickyNote);
    });
    ensureAtLeastOneNote(); // Διασφαλίστε ότι υπάρχει τουλάχιστον ένα sticky note
    showAddButton(); // Εμφάνιση κουμπιού προσθήκης στο τελευταίο sticky note
  } else {
    // Αν δεν υπάρχουν αποθηκευμένα sticky notes, προσθέτουμε τουλάχιστον ένα
    const newStickyNote = createStickyNote("", true);
    container.appendChild(newStickyNote);
    showAddButton(); // Εμφάνιση κουμπιού προσθήκης στο τελευταίο sticky note
  }
}

// Function to ensure at least one sticky note is present
function ensureAtLeastOneNote() {
  const notes = container.querySelectorAll(".sticky-note");
  if (notes.length === 0) {
    // Δημιουργία ενός νέου sticky note αν δεν υπάρχουν sticky notes
    const newStickyNote = createStickyNote("", true);
    container.appendChild(newStickyNote);
    saveStickyNotes(); // Αποθήκευση μετά την προσθήκη του νέου sticky note
  }
}

// Function to show the add button only on the last sticky note
function showAddButton() {
  // Αφαίρεση κουμπιού προσθήκης από όλα τα sticky notes
  container.querySelectorAll(".add-note-button").forEach(function (button) {
    button.remove();
  });

  // Προσθήκη του κουμπιού προσθήκης στο τελευταίο sticky note
  const notes = container.querySelectorAll(".sticky-note");
  if (notes.length > 0) {
    const lastNote = notes[notes.length - 1];
    // Εμφάνιση του κουμπιού προσθήκης μόνο αν υπάρχουν λιγότερα από 8 sticky notes
    if (notes.length < 8) {
      const addButton = document.createElement("button");
      addButton.className = "add-note-button";
      addButton.textContent = "+";
      addButton.addEventListener("click", function () {
        const newStickyNote = createStickyNote();
        container.appendChild(newStickyNote); // Προσθήκη του sticky note στο container
        saveStickyNotes(); // Αποθήκευση μετά την προσθήκη ενός νέου sticky note
        showAddButton(); // Εμφάνιση κουμπιού προσθήκης στο νέο τελευταίο sticky note
      });
      lastNote.appendChild(addButton);
    }
  }
}

// Φόρτωμα sticky notes κατά την αρχική φόρτωση της σελίδας
document.addEventListener("DOMContentLoaded", loadStickyNotes);
