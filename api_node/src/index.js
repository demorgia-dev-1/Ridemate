//require('dotenv').config();
// const { MongoClient } = require("mongodb");

const express = require("express");
const cors = require("cors");
const ValidationError = require("./errors/ValidationError");
const {port} = require('../config');
const connect = require('./connection');
// const {port,dbURL,dbName} = require('../config');


// const port = process.env.PORT || 3001;
// const dbURL = process.env.MONGODB_URL || "http://localhost";
// const dbName = process.env.MONGODB_DB_NAME || "test";

const app = express();
app.use(cors());
app.use(express.json());

connect().then(db => {




// let db;

// async function runConnect() {
//   try {
//     await client.connect();
//     db = client.db(dbName);
//     const users = db.collection("users");
//     users.createIndex({ email: 1 }, { unique: true });

//     console.log("Connected to MongoDB!");
//   } catch (e) {
//     console.error("Error connecting to MongoDB", e);
//   }
// }
// runConnect();

const handleNewuser = (user) => {
  return new Promise(async (resolve, reject) => {
    try {
      const users = db.collection("users");
      const results = await users.insertOne(user);
      resolve(results.insertedId);
    } catch (e) {
      reject(e);
    }
  })
};



// app.get('/', (req, res) => {
//   res.send('Welcome to Ridemate API!');
// });

// Function to validate email format
function isEmailValid(email) {
  const mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return mailformat.test(email); // Use `.test` instead of `.match` for boolean result
}

// Function to validate password format
function isPasswordValid(password) {
  const passformat = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
  return passformat.test(password); // Use `.test` instead of `.match`
}

// Function to validate user input
function validateUser(user) {
  const errors = [];
  if (!user.firstName) {
    errors.push('First Name is required');
  }
  if (!user.lastName) {
    errors.push('Last Name is required');
  }
  if (!user.email) {
    errors.push('Email is required');
  } else if (!isEmailValid(user.email)) {
    errors.push('Invalid Email Format');
  }
  if (!user.password) {
    errors.push('Password is required');
  } else if (!isPasswordValid(user.password)) {
    errors.push(
      'Invalid Password Format. It must be between 6 to 20 characters, including at least one numeric digit, one uppercase letter, and one lowercase letter.'
    );
  }
  return errors;
}

// POST route to handle user registration
app.post('/users', async (req, res) => {
  const user = req.body;
  try {
    // Validate user input
    const errors = validateUser(user);

    if (errors.length > 0) {
      // Return validation errors to the client
     throw new ValidationError(errors, 'Validation Error');
    }

    // Simulate handling a new user (replace this with actual logic)
    const results = await handleNewuser(user);
    res.status(201).send(results);
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(500).send({message: error.message, errors: error.errors});
    } else
    if (error.message.startsWith('E11000')) {
      res.status(500).send('Duplicate Email of User.');
    } else {
      res.status(500).send(error.message);
    }
  }
});
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}!`);
});

module.exports = app;
