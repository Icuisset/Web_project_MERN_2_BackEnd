/* eslint-disable no-else-return */
/* eslint-disable no-console */
const express = require('express');

const router = express.Router();

const {
  findCurrentUser,
} = require('../controllers/users');

router.get('/me', findCurrentUser);

module.exports = router;
