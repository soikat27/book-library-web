// Library array
const myLibrary = [
    {title: "math", author: "keir", pageCount: 20},
    {title: "cs", author: "ivaylo", pageCount: 35}
];

// Book constructor
function Book(title, author, pageCount, readStatus)
{
    if (!new.target)
        throw Error("Missing 'new' operator while constructing object instances");

    this.title = title;
    this.author = author;
    this.pageCount = pageCount;
    this.readStatus = readStatus;
}

// Add book to the library
function addBookToLibrary()
{

}

// Display books on the page
const main = document.querySelector(".main");
function displayBooks()
{
    for (const book of myLibrary)
    {
        const title = book.title;
        const author = book.author;
        const pageCount = book.pageCount;
        const bookCard = document.createElement("div");
        bookCard.classList.add("book");
        bookCard.textContent = `The book titled ${title}, authored by ${author} has ${pageCount} pages.`;

        main.appendChild(bookCard);
    }
}
displayBooks();

