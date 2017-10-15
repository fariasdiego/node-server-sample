const cluster = require('cluster')
const numCPUs = require('os').cpus().length
const app = require('./config')

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }
} else {
  app.listen(3000, (err) => console.log(err ? err : 'listening on 3000 port'))
}