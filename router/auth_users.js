const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  if (users.length < 0) {
    return false;
  } else {
    const result = users.map((user) => user.username).includes(username);
    return result;
  }
};

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("Customer successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const author = books[isbn].author;
  const title = books[isbn].title;
  const addReview = {
    author,
    title,
    reviews: { review },
  };
  books[isbn] = addReview;
  res.status(200).json({
    message: `the review for the book with ISBN ${isbn} has been added/updated.`,
    Books: books,
    addReview: addReview,
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const author = books[isbn].author;
  const title = books[isbn].title;
  const deleteReview = {
    author,
    title,
    reviews: {},
  };
  books[isbn] = deleteReview;
  return res.send({
    message: `review for the ISBN ${isbn} posted by the user test deleted.`,
    bookList: books,
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
