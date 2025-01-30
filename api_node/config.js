require('dotenv').config();

let dbName = process.env.MONGODB_DB_NAME || "test";
let port = process.env.PORT || 3001;
if(process.env.NODE_ENV !== 'test') {
  dbName = process.env.MONGODB_DB_NAME_TEST || "test";
  port = 3002;
}
module.exports = {
  port: process.env.PORT || 3001,
  dbURL: process.env.MONGODB_URL || "http://localhost",
  dbName: process.env.MONGODB_DB_NAME || "test",
};