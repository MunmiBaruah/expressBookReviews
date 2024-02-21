const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{
  console.log(users)
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  console.log("I am here")
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({message: "Error logging in"});
  }
  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken,username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let review = req.body.review
  let username = req.body.username
  let isbn=req.params.isbn
  if (isValid(username) && username === req.session.authorization.username) {
    let availableReview = JSON.stringify(books[isbn].reviews)
    let tempBooks = books
    if (availableReview.length>0) {
      tempBooks[isbn].reviews[username] = review
      books = tempBooks
    } else {
      books[isbn].reviews = {username:review}
    }
    console.log(books)
    res.send(`Customer ${username}'s review updated.`);
  } else {
    return res.status(300).json({message: "Review not updated"});
  }
});

// Add a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  let username = req.body.username
  let isbn=req.params.isbn
  if (isValid(username) && username === req.session.authorization.username) {
    let availableReview = JSON.stringify(books[isbn].reviews)
    let tempBooks = books
    if (availableReview.length>0) {
      tempBooks[isbn].reviews[username] = ""
      books = tempBooks
    }
    console.log(books)
    res.send(`Customer ${username}'s review has been deleted.`);
  } else {
    return res.status(300).json({message: "Review not updated"});
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.books = books;
