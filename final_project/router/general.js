const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(300).json({message: "User already exists!"});
    }
  }
  return res.status(300).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let bookList = {books}
  res.send(JSON.stringify(bookList,null,4));

  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = parseInt(req.params.isbn);
  // console.log(books.length)
  // if (isbn > 0) {
  console.log(isbn)
  let book = books[isbn]
  if(book){
    res.send(JSON.stringify(book,null,4));
  } else {
    return res.status(300).json({message: "No book found."});
  }
  // }

  //Write your code here
  return res.status(300).json({message: "No book found."});
});

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author;
  let tempBooks = []
  for (let i=1;i<=10;i++) {
    console.log(books[i].author)
    if (books[i].author === author) {
        let book = {}
        book.isbn = i.toString();
        book.title = books[i].title;
        book.reviews = books[i].reviews;
      tempBooks.push(book)
      // res.send(JSON.stringify(books[i],null,4));
    }
  }
  if (tempBooks.length > 0 ) {
    let booksByAuth = {"booksbyauthor":tempBooks}
    res.send(JSON.stringify(booksByAuth,null,4));
  }else {
    return res.status(300).json({message: "No book found"});
  }



//   return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title;
  let tempBooks = []
  for (let i=1;i<=10;i++) {
    console.log(books[i].title)
    if (books[i].title === title) {
        let book = {}
        book.isbn = i.toString();
        book.author = books[i].author;
        book.reviews = books[i].reviews;
        tempBooks.push(book)
    }
  }
  if (tempBooks.length > 0 ) {
    let booksByTitle = {"booksbytitle":tempBooks}
    res.send(JSON.stringify(booksByTitle,null,4));
  }else {
    return res.status(300).json({message: "No book found"});
  }

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;

  if (isbn) {
    res.send(books[isbn].reviews)
  } else {
    return res.status(300).json({message: "No book found"});
  }
});


//async-await with Axios
//Task 10: getting the list of books available in the shop
//=========================================================
const axios = require('axios');
//baseUrl="http://localhost:5000"
const getListOfBooks = async (baseUrl) =>{
  let listOfBooks = await axios.get(baseUrl);
  if (listOfBooks) {
    return listOfBooks
  }
}

//Task 11: getting the book details based on isbn
//===============================================
//baseUrl="http://localhost:5000"
const getBookDetailsBasedOnIsbn = async(baseUrl, isbn) => {
  let bookDetails = await axios.get(baseUrl + "/isbn/" + isbn)
  if (bookDetails) {
    return bookDetails
  } else {
    return null
  }
}

//Task 12: getting the book details based on Author
//baseUrl="http://localhost:5000"
const getBookDetailsBasedOnAuthor = async(baseUrl, author) => {
  let bookDetails = await axios.get(baseUrl + "/author/" + author)
  if (bookDetails) {
    return bookDetails
  } else {
    return null
  }
}


//Task 13: getting the book details based on Title
//baseUrl="http://localhost:5000"
const getBookDetailsBasedOnTitle = async(baseUrl, bookTitle) => {
  let bookDetails = await axios.get(baseUrl + "/title/" + bookTitle )
  if (bookDetails) {
    return bookDetails
  } else {
    return null
  }
}

module.exports.general = public_users;
module.exports.users = users;
