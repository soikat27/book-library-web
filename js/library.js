// Library array
const myLibrary = [
    {title: "math", author: "keir", pageCount: 20},
    {title: "cs", author: "ivaylo", pageCount: 35}
];

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

// Add book to the library
function addBookToLibrary()
{

}

// Display books on the page
const bookshelf = document.querySelector(".middle");
function displayBooks()
{
    for (const book of myLibrary)
    {
        const title = book.title;
        const author = book.author;
        const totalPages = book.totalPages;
        const bookColumn = document.createElement("div");
        bookColumn.classList.add("book");
        bookColumn.textContent = `The book titled ${title}, authored by ${author} has ${totalPages} pages.`;

        bookshelf.appendChild(bookColumn);
    }
}
displayBooks();

function createBookColumn(title, author, totalPages, readStatus)
{
    
}

