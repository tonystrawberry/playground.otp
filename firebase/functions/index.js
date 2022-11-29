/* eslint-disable max-len */
require("dotenv").config();

const admin = require("firebase-admin");
const functions = require("firebase-functions");
const createUser = require("./createUser");
const requestOneTimePassword = require("./requestOneTimePassword");
const verifyOneTimePassword = require("./verifyOneTimePassword");

const serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://playground-otp-default-rtdb.asia-southeast1.firebasedatabase.app",
});

exports.createUser = functions.https.onRequest(createUser);
exports.requestOneTimePassword = functions.https.onRequest(requestOneTimePassword);
exports.verifyOneTimePassword = functions.https.onRequest(verifyOneTimePassword);
