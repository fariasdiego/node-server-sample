const BusinessError = require('./BusinessError')

module.exports = class AuthenticationError extends BusinessError {
  constructor (message='you shall not pass') {
    super(message);
  }
};