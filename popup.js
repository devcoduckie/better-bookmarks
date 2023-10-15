// ADD BOOKMARK SECTION

function fillCurrentTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    document.getElementById("urlInput").value = tab.url;
  });
}

function saveBookmark() {
  const url = document.getElementById("urlInput").value;
  const note = document.getElementById("note").value;

  if (url && note) {
    const data = { url, note };

    // Retrieve existing bookmarks or initialize an empty array
    chrome.storage.sync.get({ bookmarks: [] }, (result) => {
      const bookmarks = result.bookmarks;
      bookmarks.push(data);

      // Save the updated bookmarks
      chrome.storage.sync.set({ bookmarks }, () => {
        document.getElementById("urlInput").value = "";
        document.getElementById("note").value = "";

        console.log("Bookmark saved successfully!");
      });
    });
  }
}

document
  .getElementById("fillCurrentTab")
  .addEventListener("click", fillCurrentTab);
document
  .getElementById("bookmarkButton")
  .addEventListener("click", saveBookmark);

document.getElementById("browseButton").addEventListener("click", () => {
  showBrowseSection();
});

// BROWSE MY BOOKMARKS SECTION

function createBookmarkEntry(url, note) {
  const entry = document.createElement("div");
  entry.classList.add("bookmark-entry");

  const title = document.createElement("div");
  title.classList.add("bookmark-title");
  title.innerText = url;

  const noteText = document.createElement("div");
  noteText.classList.add("bookmark-note");
  noteText.innerText = note;
  noteText.style.display = "none";

  const buttonsDiv = document.createElement("div");
  buttonsDiv.classList.add("visit-delete-container");

  const visitButton = document.createElement("button");
  visitButton.classList.add("bookmark-visit-button");
  visitButton.innerText = "Visit";

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("bookmark-delete-button");
  deleteButton.innerText = "Delete";

  title.addEventListener("click", () => {
    noteText.style.display =
      noteText.style.display === "none" ? "block" : "none";
  });

  visitButton.addEventListener("click", () => {
    chrome.tabs.create({ url: url });
  });

  deleteButton.addEventListener("click", () => {
    chrome.storage.sync.get({ bookmarks: [] }, (result) => {
      const bookmarks = result.bookmarks;
      const updatedBookmarks = bookmarks.filter(
        (bookmark) => bookmark.url !== url
      );
      chrome.storage.sync.set({ bookmarks: updatedBookmarks });

      entry.remove();
    });
  });

  buttonsDiv.appendChild(visitButton);
  buttonsDiv.appendChild(deleteButton);

  entry.appendChild(title);
  entry.appendChild(noteText);
  entry.appendChild(buttonsDiv);

  return entry;
}

function loadBookmarks() {
  const bookmarkList = document.querySelector(".bookmark-list");

  bookmarkList.innerHTML = "";

  chrome.storage.sync.get({ bookmarks: [] }, (result) => {
    const bookmarks = result.bookmarks;

    bookmarks.forEach((bookmark) => {
      const entry = createBookmarkEntry(bookmark.url, bookmark.note);
      bookmarkList.appendChild(entry);
    });
  });
}

document.addEventListener("DOMContentLoaded", loadBookmarks);

// LAYOUT SWITCH SECTION

document.getElementById("backToBookmark").addEventListener("click", () => {
  showBookmarkSection();
});

function showBrowseSection() {
  document.getElementById("bookmark-section").style.display = "none";
  document.getElementById("browse-section").style.display = "block";
}

function showBookmarkSection() {
  document.getElementById("bookmark-section").style.display = "block";
  document.getElementById("browse-section").style.display = "none";
}

document.addEventListener("DOMContentLoaded", showBookmarkSection);

document.getElementById("browseButton").addEventListener("click", () => {
  showBrowseSection();
  loadBookmarks();
});
