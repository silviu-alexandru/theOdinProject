
let myLibrary = [
    {title:'Pinocchio',
    author: 'Carol Ceva',
    pages: '139',
    read: ''
    }, 
    {title:'The Story of Man',
    author: 'Giordano Bruno',
    pages: '256',
    read: 'on'
    }
];

function Book(title ='', author = '', pages = '0', read = '') {
    this.title = title; 
    this.author = author; 
    this.pages= pages;
    this.read=read;
    this.info = function() {
        let finished = read == 'on' ? "read" : "not read";
        return `${title} by ${author}, ${pages} pages, ${finished}`;
    };
};
// var book1 = new Book('Viva Las Vegas', 'Vasile Porojan', '134', 'not read yet')

function addBookToLibrary(ev) {

    ev.preventDefault();
    let info = document.getElementById('info');
    info.textContent = '';
    console.log(ev);
    const data = new FormData(newBookForm)
    console.log(data);
    console.log(data['1']);
    let newbookArray =[] ;
    for (const [name, value] of data) {
        newbookArray.push(value)
    }
    if (!typeof(data[3] === 'array')) {
        alert('nu ai')
    }
    console.log(...newbookArray);
    const newBok = new Book(...newbookArray);

    myLibrary.push(newBok);
    console.log(myLibrary);
    loadBooks();
    closeForm();
    
}
let mainDisplay = document.getElementById('mainDisplay');
console.log(mainDisplay);
function loadBooks() {
    mainDisplay.innerText = ''
    myLibrary.forEach(book => {
        displayBook(book)
    });
    markIt();
}

const newBookForm = document.getElementById('newBookForm');
newBookForm.addEventListener('submit', addBookToLibrary);
newBookForm.addEventListener('click', clickCose);

/* newBookBtn.addEventListener('click', ()=>{
    let title = ''; 
    let author = '';
    let pages = '';
    let read = '';
}) */
function displayBook(book) {
    let {title, author, pages, read } = book;
    const readClass = read == 'on' ? 'read' : '';
    const bookCard = document.createElement("div")
    bookCard.classList.add("book-card")
    bookCard.innerHTML = `    
        <div class="book-spine"></div>
        <div class="book-cover">
            <span class="card-author">${author}</span>
            <span class="card-title">${title}</span>
            <span class="card-pages">${pages} Pages</span>
            <span class="read-status ${readClass}"></span>
        </div>`;
    console.log(bookCard);
    mainDisplay.appendChild(bookCard)

}

function markIt() {
    const readStatusses = document.querySelectorAll(".read-status")
    readStatusses.forEach(element => {
        console.log(element);
        element.addEventListener('click', ()=>{
            element.classList.toggle('read')
        })
    });
    console.log(readStatusses);
}
const cancelFormBtn = document.getElementById("cancelBtn");
cancelFormBtn.addEventListener('click', closeForm);
const openFormBtn = document.getElementById("openDialog");
openFormBtn.addEventListener("click", openForm);
function openForm() {
    document.getElementById("newBookForm").style.display = "block";
}
  
function closeForm() {
    document.getElementById("newBookForm").style.display = "none";
}
function clickCose(ev) {
    console.log(ev.target.id);
    if (ev.target.id == 'newBookForm'){
        closeForm();
    }
}
loadBooks();
