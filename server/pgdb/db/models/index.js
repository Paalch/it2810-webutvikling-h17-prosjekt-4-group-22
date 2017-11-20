// ///////////////////////////////////////////////////
// Setup for Sequalize connection
// ///////////////////////////////////////////////////

// Constants declarations
const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')

const basename = path.basename(module.filename)

// Dictionary to store references to the models
let db = {}

const DB_USER = process.env.P4_PGDB_USER || 'postgres'
const DB_PASSWORD = process.env.P4_PGDB_PASSWORD || 'postgres'
const DB_HOST = process.env.P4_PGDB_HOST || '127.0.0.1'
const DB_PORT = process.env.P4_PGDB_PORT || '5432'
const DB_NAME = process.env.P4_PGDB_NAME || 'it2810-g22-p4-dev'
const DB_URL = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`

var sequelize = new Sequelize(DB_URL, { logging: false })

// Adds all models to the database dictionary, "db"
try {
  fs
    .readdirSync(__dirname)
    .filter(function (file) {
      return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
    })
    .forEach(function (file) {
      var model = sequelize.import(path.join(__dirname, file))
      db[model.name] = model
    })

  Object.keys(db).forEach(function (modelName) {
    if (db[modelName].associate) {
      db[modelName].associate(db)
    }
  })
} catch (err) {
  console.error(err)
}

db.sequelize = sequelize
db.Sequelize = Sequelize

// Sequelize authenticates with the database and syncs if it's successful.
sequelize
  .authenticate()
  .then(function (auth) {
    console.log('[sequelize] Connection has been established successfully.')
  }).then(function () {
    sequelize
      .sync()
      .then(function (err) {
        if (err && process.env.DEBUG) {
          console.error(err)
        }
        console.log('[sequelize] Database sync complete')
        if (process.env.VIESTINTA_INIT_DATABASE) {
          require('../../init')
        }
      }, function (err) {
        console.error('[sequelize] An error occurred while creating the table:', err)
      })
  })
  .catch(function (err) {
    console.error('[sequelize] Unable to connect to the database:', err)
  })

// exports db object with all relevant references to models
module.exports = db
