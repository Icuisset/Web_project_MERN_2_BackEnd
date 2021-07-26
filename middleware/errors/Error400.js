/* eslint-disable linebreak-style */
// eslint-disable-next-line linebreak-style
class Error400 extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

module.exports = Error400;
