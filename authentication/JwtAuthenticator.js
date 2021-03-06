const AuthenticationError = require('../errors/AuthenticationError')
const jwt = require('jsonwebtoken')

module.exports = class JwtAuthenticator {
  constructor(secretKey) {
    this.secretKey = secretKey
  }

  sign(user) {
    return jwt.sign(user, this.secretKey, {expiresIn: '30 minutes'});
  }

  verify(token) {
    if (!token) {
      throw new AuthenticationError()
    }

    try {
      return jwt.verify(token, this.secretKey)
    } catch (ignored) {
      throw new AuthenticationError()
    }
  }
}