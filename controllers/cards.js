/* eslint-disable no-undef */
/* eslint-disable quotes */
/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable linebreak-style */
const Card = require('../models/card');
const Error400 = require("../middleware/errors/Error400");
const Error404 = require("../middleware/errors/Error404");
const Error403 = require("../middleware/errors/Error403");
const Error500 = require("../middleware/errors/Error500");

// eslint-disable-next-line no-multiple-empty-lines
/** GET /cards — returns all cards */
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((err) => {
      console.log(err);
      throw new Error500('Cards not found');
    })
    .catch(next);
};

/** POST /cards — creates a new card */
module.exports.createCard = (req, res, next) => {
  console.log(req.body);
  const owner = req.user._id;
  const {
    name,
    link,
  } = req.body;
  Card.create({
    name,
    link,
    owner,
  })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      console.log(err);
      throw new Error500('Card not created');
    })
    .catch(next);
};

/** DELETE /cards/:cardId — deletes a card by _id */
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new Error404('Card ID is not valid');
      }
      if (req.user._id.toString() !== card.owner.toString()) {
        throw new Error403('You do not have the necessary rights to delete this card');
      }
      return Card.remove(card).then(() => { res.send({ data: card }); });
    })
    .catch(next);
};

/** PUT /cards/:cardId/likes — like a card */
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, {
    $addToSet: {
      likes: req.user._id,
    },
  }, // add _id to the array if it's not there yet
  {
    new: true,
  })
    .then((card) => {
      if (card) {
        res.status(200).send(card);
      } else {
        throw new Error404('cardId not found');
      }
    })
    .catch((err) => {
      console.log(err.name);
      if (err.name === 'CastError') {
        throw new Error400('Card Id is not valid');
      } else {
        throw new Error404('Card like was not added');
      }
    })
    .catch(next);
};

/** DELETE /cards/:cardId/likes — dislike a card */
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, {
    $pull: {
      likes: req.user._id,
    },
  }, // remove _id to the array if it's there
  {
    new: true,
  })
    .then((card) => {
      if (card) {
        res.status(200).send(card);
      } else {
        throw new Error404('card Id not found');
      }
    })
    .catch((err) => {
      console.log(err.name);
      if (err.name === 'CastError') {
        throw new Error400('card Id is not valid');
      } else {
        throw new Error404('Card like was not removed');
      }
    })
    .catch(next);
};
