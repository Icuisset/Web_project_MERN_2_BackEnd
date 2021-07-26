/* eslint-disable linebreak-style */
const mongoose = require('mongoose');
const validator = require('validator');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  title: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  text: {
    type: String,
    minlength: 2,
    maxlength: 500,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  source: {
    type: String,
    minlength: 2,
    maxlength: 50,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v, { protocols: ['http', 'https'] }),
      message: 'Please enter a valid URL address',
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v, { protocols: ['http', 'https'] }),
      message: 'Please enter a valid URL address',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
},
{ versionKey: false });

module.exports = mongoose.model('Article', articleSchema);
