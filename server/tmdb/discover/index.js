/**
 * Main exporter for the Discover Feature.
 */

const fetch = require('node-fetch')
const queryString = require('query-string')
const GenreController = require('../../pgdb/db/controllers/GenreController')

const movie = async () => {
  try {
    const response = await global.tmdb.discover.movie()
    let results = response.results

    await Promise.all(results.map(async (movie) => {
      movie.genres = GenreController.getGenreMovieMem(movie.genre_ids)
      movie.watchlist = false
      movie.library = false
      movie.media_type = 'movie'
      return movie
    }))

    return results
  } catch (err) {
    console.error(err)
  }
}

/**
 * Define constants for Discover TV
 */
const API_ENDPOINT = 'https://api.themoviedb.org/3'
const FEATURE_URL = '/discover/tv'
const API_KEY = process.env.P4_TMDB_TOKEN || '14aaf9ea405e5c25e5a9ed2e6792e35e'
const PARAMETERS = {
  api_key: API_KEY,
  sort_by: 'popularity.desc',
  page: 1,
  include_null_first_air_dates: false
}

/**
 * Discover TV is a method of the TMDB API, but it was not correctly implemented in the API wrapper we are using.
 * Therefore we have implemented out own wrapper method for the Discover TV functionality.
 */
const tv = async () => {
  try {
    const reqUrl = `${API_ENDPOINT}${FEATURE_URL}?${queryString.stringify(PARAMETERS)}`
    let response = await fetch(reqUrl)
    response = await response.json()
    let results = response.results

    await Promise.all(results.map(async (series) => {
      series.title = series.name
      series.release_date = series.first_air_date
      series.genres = GenreController.getGenreTvMem(series.genre_ids)
      series.watchlist = false
      series.library = false
      series.media_type = 'tv'
      return series
    }))

    return results
  } catch (err) {
    console.error(err)
  }
}

module.exports = {
  movie, tv
}
