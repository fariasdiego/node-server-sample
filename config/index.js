const express = require('express')
const cors = require('cors')
const winston = require('winston')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const consign = require('consign')
const JwtAuthenticator = require('../authentication/JwtAuthenticator')
const AuthenticationError = require('../errors/AuthenticationError')

const app = express()
const jwtSecretKey = process.env['JWT_KEY']

const logger = winston.createLogger({
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console()
  ]
})

app.logger = logger
app.authenticator = new JwtAuthenticator(jwtSecretKey)

const getDecodedToken = (req) => {
  let header = req.header('Authorization')
  if (header) {
    return app.authenticator.verify(header.split('Bearer').pop().trim())
  }

  return null
}

app.getDecodedToken = getDecodedToken

// third party middlewares
app
  .use(cors())
  .use(morgan('tiny'))
  .use(bodyParser.json())

// custom middlewares
app
  .use(/^(?!\/login).*$/, (req, res, next) => {
    getDecodedToken(req)
    next()
  })

consign()
  .include('routes')
  .then('errorAdvice')
  .into(app)
  
module.exports = app