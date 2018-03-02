import { connect } from 'joiql-mongo'
import hotglue from 'hotglue'
import babelify from 'babelify'
import envify from 'envify'
import brfs from 'brfs-babel'
import path from 'path'

const { MONGODB_URI, PORT, SESSION_KEYS } = process.env

// Bundle together client and server app for hot reloading, and—
// to be implemented—production ready asset bundle serving
// when NODE_ENV=production
const app = module.exports = hotglue({
  relative: path.join(__dirname, '/app'),
  server: {
    main: 'server.js',
    watch: [
      'views/**/*',
      'controllers/**/*',
      'models/**/*',
      'router.js',
      'server.js'
    ]
  },
  client: {
    main: 'client.js',
    transforms: [brfs, babelify, envify],
    watch: [
      'views/**/*',
      'controllers/**/*',
      'router.js',
      'client.js'
    ]
  }
})

// Connect to Mongo and run app
const db = connect(MONGODB_URI, { authMechanism: 'ScramSHA1' })
app.keys = SESSION_KEYS.split(',')
app.listen(PORT)
console.log('Listening on ' + PORT)

// Every 5 minute tasks

// Daily tasks

const runOften = (fn, time) => {
  fn(db)
  setInterval(() => { fn(db) }, time)
}
