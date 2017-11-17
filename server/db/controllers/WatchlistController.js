const UserMovie = require('../models/Watchlist/WatchlistUserMovie')
const UserTv = require('../models/Watchlist/WatchlistUserTv')
const LibraryUserMovie = require('../models/Library/LibraryUserMovie')
const LibraryUserTv = require('../models/Library/LibraryUserTv')
const tmdbWrapper = require('../../tmdb/')
const Movie = require('../models/Movie')

/**
 * Retunes a movie element for a given movieID
 * @param moiveID
 * @param user
 * @returns {Promise.<*>}
 */
let getMovieForUser = async(movieID, user, type) => {
    let movieKey = await Movie.findOne({movie_id: movieID})
    if(movieKey){
      if(type==='watchlist') {
        let userMovie = await UserMovie.findOne({movie_id: movieKey, user_id: user._id})
        return userMovie ? userMovie: false
      }
      else if(type==='library') {
        let userMovie = await LibraryUserMovie.findOne({movie_id: movieKey, user_id: user._id})
        return userMovie ? userMovie: false
      }
    }
    return false
}

/**
 * Findes the _id for a given movie_id
 * @param moiveID
 * @returns {Promise.<*>}
 */
let getMovieKey = async(movieID) => {
  const movieKey = await Movie.findOne({movie_id: movieID})
  if(!movieKey) {
    const addMovie = await tmdbWrapper.details.movie(movieID, false, false)
    if(addMovie) {
      const result = await Movie.findOne({movie_id: movieID})
      return result._id
    }
    return false
  }
  return movieKey._id
}
let getMovieId = async(movieKey) => {
  result =  await Movie.findOne({_id: movieKey})
  let id = result.movie_id
  return id
}

/**
 * Creates a new entry in the UserMovie collection
 * with a given movie_id and user._id
 * @param movieID
 * @param user
 * @returns {Promise.<boolean>}
 */
let newMovie = async (movieID, user) => {
  //Looks for a given movie in watchlist and library
  let movieWatchlist = await getMovieForUser(movieID, user, 'watchlist')
  let movieLibrary = await getMovieForUser(movieID, user, 'library')
  // to add a movie it can not be in library or watchlist
  if (!movieWatchlist && !movieLibrary) {
    try {
      let userMovie = new UserMovie()
      userMovie.movie_id = await getMovieKey(movieID)
      userMovie.user_id = user._id
      userMovie.save()
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  }
  return false
}

/**
 * Removes any nulls or undefined from object before returning it
 */
let clean = (watchlist) => {
  let returnList = watchlist.filter((movie) => movie)
  return returnList
}

/**
 * Findes all the movies the given user have in his/hers watchlist
 * @param user
 * @returns {Promise.<*[]>}
 */
let findMovieForUser = async (user) => {
  // Findes all the movies, that are in the watchlist of the current user
  let userMovies = await UserMovie.find({user_id: user._id})
  // For each id in the UserMovie database, we return all the informasjon about the movie, we use
  // promise all to make sure that the array is not returned while pending
  try {
    return clean(await Promise.all(userMovies.map(async (movie) => {
      let movieID = await getMovieId(movie.movie_id)
      const watchlist = true
      const library = false
      return tmdbWrapper.details.movie(movieID, watchlist, library)
    })))
  } catch (err) {
    console.log(err)
  }
}

/**
 * Removes all movies with the given MovieID and user
 * @param movieID
 * @param user
 * @returns {Promise.<boolean>}
 */
let removeMovieForUser = async (movieID, user) => {
  try {
    const movieKey = await getMovieKey(movieID)
    await UserMovie.remove({movie_id: movieKey, user_id: user._id})
  } catch (err) {
    console.log(err)
    return false
  }
  return true
}

/**
 * Addes a new tv-show to the watchlist for a given user
 * @param tvID
 * @param user
 * @returns {Promise.<boolean>}
 */
let newTv = async (tvID, user) => {
  let movie = await UserTv.findOne({tv_id: tvID, user_id: user._id})
  let libraryTv = await LibraryUserTv.findOne({tv_id: tvID, user_id: user._id})
  // checks that tv-show is not in library or watchlist
  if (!movie && !libraryTv) {
    try {
      let userTv = new UserTv()
      userTv.tv_id = tvID
      userTv.user_id = user._id
      userTv.save()
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  }
  return false
}

/**
 * Findes all the movies the given user have in his/hers watchlist
 * @param user
 * @returns {Promise.<*[]>}
 */
let findTvForUser = async (user) => {
  // Findes all the movies, that are in the watchlist of the current user
  let userTv = await UserTv.find({user_id: user._id})
  // For each id in the tvMovie database, we return all the informasjon about the movie, we use
  // promise all to make sure that the array is not returned while pending
  try {
    return clean(await Promise.all(userTv.map(async (tv) => {
      const watchlist = true
      const library = false
      const details = await tmdbWrapper.details.tv(tv.tv_id, watchlist, library)
      return details
    })))
  } catch (err) {
    console.log(err)
  }
}

/**
 * Removes all movies with the given MovieID and user
 * @param movieID
 * @param user
 * @returns {Promise.<boolean>}
 */
let removeTvForUser = async (tvID, user) => {
  try {
    await UserTv.remove({tv_id: tvID, user_id: user._id})
  } catch (err) {
    console.log(err)
    return false
  }
  return true
}

module.exports = {
  newMovie,
  findMovieForUser,
  removeMovieForUser,
  newTv,
  findTvForUser,
  removeTvForUser
}
