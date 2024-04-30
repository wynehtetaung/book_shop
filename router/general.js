const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const userData = {
    username,
    password,
  };
  if (username && password) {
    if (!isValid(username)) {
      users.push(userData);
      res.status(200).json({
        message: "Customer Successfully registered.You can login.",
      });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  } else {
    return res.status(404).json({ message: "Unable to register user." });
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  res.send(JSON.stringify({ books }, null, 6));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const book = Object.values(books).find((book) => book.author === author);
  const isbn =
    Object.values(books).findLastIndex((book) => book.author === author) + 1;
  const bookObj = {
    isbn,
    title: book.title,
    reviews: book.reviews,
  };
  let booksByAuthor = [];
  booksByAuthor = [...booksByAuthor, bookObj];

  res.send(JSON.stringify({ booksByAuthor }, null, 5));
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const book = Object.values(books).find((book) => book.title === title);
  const isbn =
    Object.values(books).findLastIndex((book) => book.title === title) + 1;
  const bookObj = {
    isbn,
    author: book.author,
    reviews: book.reviews,
  };
  let booksByTitle = [];
  booksByTitle = [...booksByTitle, bookObj];

  res.send(JSON.stringify({ booksByTitle }, null, 5));
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  res.send(book.reviews);
});

module.exports.general = public_users;
