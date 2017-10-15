const AuthenticationError = require('../errors/AuthenticationError')

const user = {
  email: 'diegodpf@gmail.com',
  password: '123456'
}

module.exports = (app) => {
  app.get('/', (req, res) => {
    res.json({app: 'server', version: '0.0.1'}).status(200).end()
  })

  app.post('/login', (req, res) => {
    const credentials = req.body

    if (credentials.username !== user.email || credentials.password !== user.password) {
      throw new AuthenticationError()
    }

    const token = app.authenticator.sign({username: credentials.username})
    res.json({token: token}).status(200).end()
  })
}