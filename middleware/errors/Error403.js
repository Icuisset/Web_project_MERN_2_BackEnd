/* eslint-disable linebreak-style */
// eslint-disable-next-line linebreak-style
class Error403 extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

module.exports = Error403;
