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
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(method),
  }),
}), createCard);

router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), deleteCard);

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), likeCard);

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), dislikeCard);

module.exports = router;
