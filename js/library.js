/**
 * Book Library — browser UI for a small in-memory reading list.
 *
 * Architecture:
 * - Book: domain model (identity + fields + behavior).
 * - myLibrary: IIFE module — owns the canonical array; only exported methods mutate it.
 * - myLibraryUi: IIFE module — DOM queries, delegated events, and re-render from library state.
 *
 * Data flow: user action → update myLibrary → displayBooks() rebuilds rows from getAllBooks().
 * No persistence yet; state resets on full page reload.
 */

/**
 * Represents one shelf entry. crypto.randomUUID() gives a stable key for DOM data-id
 * and for lookups after re-renders (rebuild replaces nodes; ids tie UI back to data).
 */
class Book {
    // constructor
    constructor (title, author, totalPages, readStatus) {
        this.id = crypto.randomUUID();
        this.title = title;
        this.author = author;
        this.totalPages = totalPages;
        this.readStatus = readStatus;
    }

    // methods
    toggleReadStatus() {
        this.readStatus = !this.readStatus;
    }
}

/**
 * Library data layer (module pattern).
 * - `bookshelf` is private to this closure — not exported — so callers can’t splice/replace
 *   the backing store accidentally.
 * - Mutations go through addBook / removeBook / toggleReadStatus only.
 * - getAllBooks returns a shallow array copy so iteration is safe without leaking the live array.
 */
const myLibrary = (() => {
    let bookshelf = [];

    function addBook (title, author, totalPages, readStatus) {
        const book = new Book (title, author, totalPages, readStatus);
        bookshelf.push(book);
    }

    function removeBook (bookId) {
        bookshelf = bookshelf.filter(book => book.id !== bookId);
    }

    function toggleReadStatus (bookId) {
        const book = bookshelf.find(book => book.id === bookId);
        if (book)
            book.toggleReadStatus();
    }

    /**
     * Shallow copy of the book list. Same Book object references as the internal array,
     * but a new array instance — callers can’t push/pop the canonical shelf through this return value.
     */
    function getAllBooks () {
        return [...bookshelf]; // return a shallow copy
    }

    return {addBook, removeBook, toggleReadStatus, getAllBooks};
})();

/**
 * Presentation + wiring. Keeps DOM concerns out of the data module.
 * Event delegation on `.middle`: one listener surface for dynamically added rows (no per-row listeners).
 */
const myLibraryUi = (() => {
    // DOM elements...
    const form = document.querySelector("#book-form");
    const bookshelf = document.querySelector(".middle");
    const dialog = document.querySelector("dialog");
    const addBookButton = document.querySelector(".add-book");
    const cancelButton = document.querySelector(".cancel");

    function displayBooks() {
        clearBookshelf();

        for (const book of myLibrary.getAllBooks())
            createBookColumn(book.title, book.author, book.totalPages, book.id, book.readStatus);
    }

    /**
     * Removes every child under the shelf except `.col-head` (static header row in HTML).
     * Uses [...children] because `children` is a live HTMLCollection — mutating the DOM while
     * iterating it in place can skip siblings (e.g. orphan <hr> after each redraw).
     */
    function clearBookshelf () {
        [...bookshelf.children].forEach((child) => {
            if (!child.classList.contains("col-head"))
                child.remove();
        });
    }

    /**
     * One row template: book container + trailing separator. readStatus seeds the checkbox;
     * after toggles, displayBooks() re-syncs from model so UI matches data.
     */
    function createBookColumn(title, author, totalPages, bookId, readStatus)
    {
        const html = `
        <div class="book" data-id="${bookId}">
            <h3 class="title">${title}</h3>
            <h3 class="author">${author}</h3>
            <h3 class="pc">${totalPages}</h3>
            <div>
                <input type="checkbox" class="rs" ${readStatus ? "checked" : ""}>
                <button class="remove">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 30 30">
                        <path d="M15,3C8.373,3,3,8.373,3,15c0,6.627,5.373,12,12,12s12-5.373,12-12C27,8.373,21.627,3,15,3z M16.414,15 c0,0,3.139,3.139,3.293,3.293c0.391,0.391,0.391,1.024,0,1.414c-0.391,0.391-1.024,0.391-1.414,0C18.139,19.554,15,16.414,15,16.414 s-3.139,3.139-3.293,3.293c-0.391,0.391-1.024,0.391-1.414,0c-0.391-0.391-0.391-1.024,0-1.414C10.446,18.139,13.586,15,13.586,15 s-3.139-3.139-3.293-3.293c-0.391-0.391-0.391-1.024,0-1.414c0.391-0.391,1.024-0.391,1.414,0C11.861,10.446,15,13.586,15,13.586 s3.139-3.139,3.293-3.293c0.391-0.391,1.024-0.391,1.414,0c0.391,0.391,0.391,1.024,0,1.414C19.554,11.861,16.414,15,16.414,15z"></path>
                    </svg>
                </button>
            </div>
        </div>
        <hr>`;

        bookshelf.insertAdjacentHTML("beforeend", html);
    }

    /**
     * Wires global controls (dialog, form) and delegated shelf clicks.
     * removeBook / toggleReadStatus filter by event target so clicks on nested SVG still resolve.
     */
    function setEventListeners() {
        // add/remove books/toggle read-status
        addBookButton.addEventListener("click", () => {
            dialog.showModal();
        });
        bookshelf.addEventListener("click", removeBook);
        bookshelf.addEventListener("click", toggleReadStatus);

        // form buttons
        form.addEventListener("submit", addBook);
        cancelButton.addEventListener("click", () => {
            dialog.close();
        });

        // form input validation
        document.getElementById("title").addEventListener("input", validateTextFields);
        document.getElementById("author").addEventListener("input", validateTextFields);
        document.getElementById("pc").addEventListener("input", validateTextFields);
    }

    function addBook(event)
    {
        event.preventDefault();
        const form = event.currentTarget;
        validateTextFields();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }    

        const title = document.getElementById("title").value;
        const author = document.getElementById("author").value;
        const pages = document.getElementById("pc").value;
        const read = document.getElementById("read").checked;

        myLibrary.addBook(title, author, pages, read);
        displayBooks();

        dialog.close();
        form.reset();
    }

    function removeBook(event) {
        if (event.target.closest(".remove"))
        {
            const book = event.target.closest(".book");
            if (!book)
                return;
            const bookId = book.dataset.id;

            // remove from the library array
            myLibrary.removeBook (bookId);
            displayBooks();
        }
    }

    function toggleReadStatus (event) {
        if (event.target.closest(".rs"))
        {
            const book = event.target.closest(".book");
            if (!book)
                return;
            const bookId = book.dataset.id;

            myLibrary.toggleReadStatus(bookId);
            displayBooks();
        }
    }

    function validateTextFields(event) {
        const title  = document.getElementById("title");
        const author = document.getElementById("author");
        const pc     = document.getElementById("pc");
        
        // 1. clear old custom validation
        title.setCustomValidity("");
        author.setCustomValidity("");
        pc.setCustomValidity("");

        // 2. set custom validation
        if (!title.value.trim())
            title.setCustomValidity("The book title must be filled!");

        if (!author.value.trim())
            author.setCustomValidity("The author name can't be empty!");

        if (!pc.value.trim() || Number(pc.value) < 1)
            pc.setCustomValidity("Total pages must be at least 1.");
    }

    // Initialize the app
    setEventListeners();
    displayBooks();

})();

// Temp: show log-in feature not available
document.querySelector(".log-in").addEventListener("click", function () {
    alert("This feature is not available at this moment. Please check back later.")
})