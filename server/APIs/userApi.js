const exp = require("express");
const userApp = exp.Router();
const UserAuthor = require("../models/userAuthorModel.js");
const expressAsyncHandler = require("express-async-handler");
const createUserOrAuthor = require("./createUserOrAuthor.js");

//API


//create new user
userApp.post("/user", expressAsyncHandler(createUserOrAuthor))

module.exports = userApp;
