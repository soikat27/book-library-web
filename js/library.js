// Library array
var myLibrary = [];

// Book constructor
function Book(title, author, totalPages, readStatus)
{
    if (!new.target)
        throw Error("Missing 'new' operator while constructing object instances");

    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.totalPages = totalPages;
    this.readStatus = readStatus;
}

Book.prototype.toggleReadStatus = function () {
    this.readStatus = !this.readStatus;
};

// Add book to the library
const form = document.querySelector("#book-form");
const bookshelf = document.querySelector(".middle");
const dialog = document.querySelector("dialog");
const addBookButton = document.querySelector(".add-book");
const cancelButton = document.querySelector(".cancel");

function addBookToLibrary(event)
{
    event.preventDefault();

    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const pages = document.getElementById("pc").value;
    const read = document.getElementById("read").checked;

    const newBook = new Book(title, author, pages, read);
    createBookColumn(title, author, pages, newBook.id, read);
    myLibrary.push(newBook);
    dialog.close();

    form.reset();
}

function displayBooks()
{
    for (const book of myLibrary)
    {
        createBookColumn(book.title, book.author, book.totalPages, book.id);
    }
}


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

addBookButton.addEventListener("click", () => {
    dialog.showModal();
});
cancelButton.addEventListener("click", () => {
    dialog.close();
});
form.addEventListener("submit", addBookToLibrary);

bookshelf.addEventListener("click", function (event) {
    if (event.target.closest(".remove"))
    {
        const book = event.target.closest(".book");
        if (!book)
            return;
        const adjHr = book.nextElementSibling;
        const bookId = book.dataset.id;

        // remove from the library array
        myLibrary = myLibrary.filter(book => book.id !== bookId);

        // remove from UI
        book.remove();
        if (adjHr)
            adjHr.remove();
    }

    else if (event.target.closest(".rs"))
    {
        const bookElement = event.target.closest(".book");
        if (!bookElement)
            return;
        const bookId = bookElement.dataset.id;

        const book = myLibrary.find(book => book.id === bookId);
        book.toggleReadStatus();
    }
});

// Temp: show log-in feature not available
document.querySelector(".log-in").addEventListener("click", function () {
    alert("This feature is not available at this moment. Please check back later.")
})


displayBooks();