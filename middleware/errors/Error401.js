/* eslint-disable linebreak-style */
// eslint-disable-next-line linebreak-style
class Error401 extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = Error401;
