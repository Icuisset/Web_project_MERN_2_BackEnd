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
  getUsers,
  findUser,
  findCurrentUser,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', findCurrentUser);

router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
}), findUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUserProfile);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(method),
  }),
}), updateUserAvatar);

module.exports = router;
