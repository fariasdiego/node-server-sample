const AuthenticationError = require('../errors/AuthenticationError')

module.exports = (app) => {
  const errorHandler = (err, req, res, next) => {
    if (err) {
      app.logger.error(err.stack)
      if (err instanceof SyntaxError) {
        res.status(400).json({error: err.message}).end()
        return
      }
  
      if (err instanceof AuthenticationError) {
        res.status(401).json(err.getObject()).end()
        return
      }
  
      res.status(500).json({error: err.message}).end()
      return
    }
  
    next()
  }
  
  const endpointNotFoundHandler = (req, res, next) => res.status(404).json({error: 'endpoint not found'}).end()

  return app
    .use(errorHandler)
    .use(endpointNotFoundHandler)
}