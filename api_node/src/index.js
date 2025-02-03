const express = require("express");
const cors = require("cors");
const ValidationError = require("./errors/ValidationError");
const { port } = require("../config");
const connect = require("./connection");

const app = express();
app.use(cors());
app.use(express.json());

let db;

connect().then((database) => {
  db = database;

  // Handle New User Registration
  const handleNewuser = async (user) => {
    try {
      if (!db) throw new Error("Database not initialized!");
      const users = db.collection("users");
      const result = await users.insertOne(user);
      return result.insertedId;
    } catch (error) {
      throw error;
    }
  };

  // Function to validate email format
  function isEmailValid(email) {
    const mailformat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return mailformat.test(email);
  }

  // Function to validate password format
  function isPasswordValid(password) {
    const passformat = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    return passformat.test(password);
  }

  // Function to validate user input
  function validateUser(user) {
    const errors = [];
    if (!user.firstName) errors.push("First Name is required");
    if (!user.lastName) errors.push("Last Name is required");
    if (!user.email) {
      errors.push("Email is required");
    } else if (!isEmailValid(user.email)) {
      errors.push("Invalid Email Format");
    }
    if (!user.password) {
      errors.push("Password is required");
    } else if (!isPasswordValid(user.password)) {
      errors.push(
        "Invalid Password Format. Must be 6-20 characters with one number, uppercase, and lowercase."
      );
    }
    return errors;
  }

  // POST route to handle user registration
  app.post("/users", async (req, res) => {
    try {
      const user = req.body;
      const errors = validateUser(user);

      if (errors.length > 0) {
        throw new ValidationError(errors, "Validation Error");
      }

      // Add user to the database
      const userId = await handleNewuser(user);
      res.status(201).json({ message: "✅ User Registered Successfully", id: userId });

    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ message: error.message, errors: error.errors });
      } else if (error.message.startsWith("E11000")) {
        res.status(400).json({ message: "Duplicate Email of User." });
      } else {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
      }
    }
  });

  // Start the server only after DB connection
  app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}!`);
  });

});

module.exports = app;