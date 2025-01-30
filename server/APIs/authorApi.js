const exp = require("express");
const authorApp = exp.Router();
// const UserAuthor = require("../models/userAuthorModel.js");
const expressAsyncHandler = require("express-async-handler");
const createUserOrAuthor = require("./createUserOrAuthor.js");
const Article = require("../models/articleModel.js");

//API

//create new author
authorApp.post("/author", expressAsyncHandler(createUserOrAuthor));

//create new article
authorApp.post(
  "/article",
  expressAsyncHandler(async (req, res) => {
    //get new article obj from req
    const newArticleObj = req.body;
    const newArticle = new Article(newArticleObj);
    const articleObj = await newArticle.save();
    res.status(201).send({ message: "article published", payload: articleObj });
  })
);


//read all articles
authorApp.get("/articles", expressAsyncHandler(async(req, res)=>{
  //read all articles from db
  const listOfArticles = await Article.find();
  res.status(200).send({message:"articles", payload: listOfArticles})
}))



module.exports = authorApp;
