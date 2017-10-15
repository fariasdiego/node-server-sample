const AuthenticationError = require('../errors/AuthenticationError')

const user = {
  email: 'diegodpf@gmail.com',
  password: '123456'
}

const users = [
  {
    email: 'diego@gmail.com',
    idade: 25,
    password: '123456'
  },
  {
    email: 'kaline@gmail.com',
    idade: 23,
    password: '654321'
  },
]

const userDao = {
  findByEmail: (email) => users.find(u => u.email === email)
}

module.exports = (app) => {
  app.get('/', (req, res) => {
    res.json({app: 'server', version: '0.0.1'}).status(200).end()
  })

  app.post('/login', (req, res) => {
    const credentials = req.body
    const user = userDao.findByEmail(credentials.username)

    if (credentials.username !== user.email || credentials.password !== user.password) {
      throw new AuthenticationError()
    }

    const token = app.authenticator.sign({username: credentials.username})
    res.json({token: token}).status(200).end()
  })

  app.get('/users', (req, res) => {
    res.json(users).status(200).end()
  })
}