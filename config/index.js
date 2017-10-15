const express = require('express')
const winston = require('winston')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const consign = require('consign')
const JwtAuthenticator = require('../authentication/JwtAuthenticator')
const AuthenticationError = require('../errors/AuthenticationError')



const app = express()
const jwtSecretKey = process.env['JWT_KEY']
const getTokenFromHeader = (header) => header ? header.split('Bearer').pop().trim() : null

const logger = winston.createLogger({
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console()
  ]
})

app.logger = logger
app.authenticator = new JwtAuthenticator(jwtSecretKey)

// third party middlewares
app
  .use(morgan('tiny'))
  .use(bodyParser.json())

// custom middlewares
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

app
  .use(/^(?!\/login).*$/, (req, res, next) => {
    const token = getTokenFromHeader(req.header('Authorization'))

    const decodedToken = app.authenticator.verify(token)
    next()
  })

consign()
  .include('routes')
  .then('errorAdvice')
  .into(app)
  
module.exports = app