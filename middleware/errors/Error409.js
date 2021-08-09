/* eslint-disable linebreak-style */
// eslint-disable-next-line linebreak-style
class Error409 extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = Error409;
