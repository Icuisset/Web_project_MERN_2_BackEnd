/* eslint-disable no-else-return */
/* eslint-disable no-console */
const express = require('express');
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const method = (value) => {
  // eslint-disable-next-line prefer-const
  let result = validator.isURL(value);
  if (result) {
    return value;
  } else {
    throw new Error('URL validation err');
  }
};

// NB : could use as well : Joi.string().uri({ scheme: ['http', 'https'] }).required(),

const router = express.Router();

const {
  getArticles,
  createArticle,
  deleteArticle,
} = require('../controllers/articles');

router.get('/', getArticles);

router.post('/', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required().min(2).max(30),
    title: Joi.string().required().min(2).max(30),
    text: Joi.string().required().min(2).max(500),
    date: Joi.date().required(),
    source: Joi.string().required().min(2).max(50),
    link: Joi.string().required().custom(method),
    image: Joi.string().required().custom(method),
  }),
}), createArticle);

router.delete('/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().hex().length(24),
  }),
}), deleteArticle);

module.exports = router;
