
/**
 * Server root file for Project 4
 */

const project = `
   __  __    _       __      __       __             __
  / / / /___| |     / /___ _/ /______/ /_  ___  ____/ /
 / / / / __ \\ | /| / / __ \`/ __/ ___/ __ \\/ _ \\/ __  / 
/ /_/ / / / / |/ |/ / /_/ / /_/ /__/ / / /  __/ /_/ /  
\\____/_/ /_/|__/|__/\\__,_/\\__/\\___/_/ /_/\\___/\\__,_/   
                                                       `

console.log(project)

/**
 * Make sure node version supports async/await.
 * If not, the program will fail with error suggesting async syntax is wrong.
 */

const NODE_VERSION = process.versions.node
const SUPPORTED_NODE_VERSION = '8.9.0'

if (NODE_VERSION.charAt(0) < SUPPORTED_NODE_VERSION.charAt(0)) {
  console.log(`
        You are running an outdated version of Nodejs!
        Nodejs version ${NODE_VERSION} is NOT supported.
        Please upgrade to at least version ${SUPPORTED_NODE_VERSION}!
    `)
  process.exit(1)
} else {
  console.log(`Running with Nodejs version ${NODE_VERSION}`)
}

/**
 * Get external dependencies
 */
const express = require('express')
const bodyparser = require('body-parser')
const cookieparser = require('cookie-parser')
const session = require('express-session')
const path = require('path')
const passport = require('passport')
const TMDb = require('tmdbapi')

/**
 * Get local dependencies
 */
const misc = require('./misc')
const routes = require('./routes')
const genre = require('./tmdb').genre

/**
 * Define constants from environment
 */
const PORT = process.env.P4_PORT || 8000
const HOST = process.env.P4_HOST || '0.0.0.0'
const ENV = process.env.P4_ENV || 'development'
const SECRET = process.env.P4_SECRET || 'MagicalNarwhalsAndPinkOrcasDancingTogetherInImaginationLand'
const TMDB_TOKEN = process.env.P4_TMDB_TOKEN || '14aaf9ea405e5c25e5a9ed2e6792e35e'

/**
 * Initial server setup
 */
// db.init()
const app = express()

var sess = {
  secret: SECRET,
  cookie: {},
  resave: true,
  saveUninitialized: true
}

if (ENV === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}

global.tmdb = new TMDb({
  apiv3: TMDB_TOKEN
})

app.use(session(sess))

app.set('view options', { pretty: true })
app.set('json spaces', 2)

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')))
app.use(cookieparser())
app.use(bodyparser.urlencoded({extended: true}))
app.use(bodyparser.json())
app.use(express.static('public'))
require('./passport')(passport)
app.use(passport.initialize())
app.use(passport.session())

app.use('/', routes)

const getGenres = async () => {
  try {
    await genre.movie()
    await genre.tv()
  } catch (err) {
    console.error()
  }
}

getGenres()

app.listen(PORT, HOST, () => console.log(`Project server running on: ${HOST}:${PORT}`))
