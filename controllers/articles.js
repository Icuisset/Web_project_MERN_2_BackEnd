/* eslint-disable no-undef */
/* eslint-disable quotes */
/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable linebreak-style */
const Article = require('../models/article');
const Error404 = require("../middleware/errors/Error404");
const Error403 = require("../middleware/errors/Error403");
const Error500 = require("../middleware/errors/Error500");

// eslint-disable-next-line no-multiple-empty-lines
/** GET /cards — returns all cards */
module.exports.getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch((err) => {
      console.log(err);
      throw new Error500('Articles not found');
    })
    .catch(next);
};

/** POST /articles — creates a new article */
module.exports.createArticle = (req, res, next) => {
  console.log(req.body);
  const owner = req.user._id;
  const {
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
  } = req.body;
  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner,
  })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      console.log(err);
      throw new Error500('Article not created');
    })
    .catch(next);
};

/** DELETE /articles/:articleId — deletes a article by _id */
module.exports.deleteArticle = (req, res, next) => {
  Article.findById(req.params.articleId)
    .then((article) => {
      if (!article) {
        throw new Error404('Article ID is not valid');
      }
      if (req.user._id.toString() !== article.owner.toString()) {
        throw new Error403('You do not have the necessary rights to delete this article');
      }
      return Article.remove(article).then(() => { res.send({ data: article }); });
    })
    .catch(next);
};
