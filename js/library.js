// Library array
const myLibrary = [
    {title: "math", author: "keir", totalPages: 44},
    {title: "cs", author: "ivaylo", totalPages: 35}
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

        createBookColumn(title, author, totalPages);
    }
}
displayBooks();

function createBookColumn(title, author, totalPages)
{
    const html = `
    <div class="book">
      <h3 class="title">${title}</h3>
      <h3 class="author">${author}</h3>
      <h3 class="pc">${totalPages}</h3>
      <div>
        <input type="checkbox" class="rs">
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

