import { Injectable } from '@angular/core'
import { Http } from '@angular/http'

import { CardElement } from 'classes/CardElement'


@Injectable()
export class WatchlistService {
  private URL = '/api/watchlist'
  public listView = false
  public loadButton: boolean
  watchlistMovie: CardElement[]
  watchlistTv: CardElement[]
  moviePageID: number
  currentMoviePageID: number
  movieMaxPageID: number
  tvPageID: number
  currentTvPageID: number
  tvMaxPageID: number


  constructor(private http: Http) {
    this.moviePageID = 1
    this.watchlistMovie = []
    this.currentMoviePageID = 1
    this.tvPageID = 1
    this.watchlistTv = []
    this.currentTvPageID = 1
  }

  public async addToWatchlist(element: CardElement) {
    const type = element.type
    const id = element.id
    try {
      const response = await this.http.post(this.URL + '/' + type, {id: id}).toPromise()
    } catch (err) {
      console.error(err)
    }
  }

  /**
   * Removes the choosen CardElement from the watchlist.
   */
  public async removeFromWatchlist(element: CardElement) {
    const type = element.type
    const id = element.id
    try {
      const response = await this.http.delete(this.URL + '/' + type, { body: {id: id} }).toPromise()
      if (element.type === 'movie') {
        const index = this.watchlistMovie.indexOf(element)
        if (index >= 0) {
          this.watchlistMovie.splice(index, 1)
        }
      } else {
        const index = this.watchlistTv.indexOf(element)
        if (index >= 0) {
          this.watchlistTv.splice(index, 1)
        }
      }
      console.log(`[Service|WatchList](removeFromWatchList) Got response`)

    } catch (err) {
      console.error(err)
    }
  }

  /**
   * getWAtchlist, gets the watchlist for the current user by getting tv and movies
   * @param {string} order
   * @param {string} orderBy
   * @param {string} search
   * @param {string} ratings
   * @param {string} years
   * @param {boolean} reset
   * @returns {Promise<void>}
   */
  public async getWatchlist(order = '', orderBy = '', search = '', ratings = '', years = '', reset= false) {
    this.getWatchlistMovie(order, orderBy, search, ratings, years, reset)
    this.getWatchlistTv(order, orderBy, search, ratings, years, reset )
  }

  /**
   * Public function for getting watchlist
   * @param {string} order
   * @param {string} orderBy
   * @param {string} search
   * @param {string} ratings
   * @param {string} years
   * @param {boolean} reset
   * @returns {Promise<void>}
   */
  public async getWatchlistMovie(order = '', orderBy = '', search = '', ratings = '', years = '', reset= false) {
    if (reset) {
      this.currentMoviePageID = 1
    }
    await this.getWatchlistServerMovie(order, orderBy, search, 1, ratings, years)

    while (this.moviePageID < this.currentMoviePageID) {
      this.moviePageID++
      await this.getWatchlistServerMovie(order, orderBy, search, this.moviePageID , ratings , years , true )
    }
    this.loadButton = this.currentMoviePageID < this.movieMaxPageID ? true : false
  }

  /**
   * Public function for getting watchlist
   * @param {string} order
   * @param {string} orderBy
   * @param {string} search
   * @param {string} ratings
   * @param {string} years
   * @param {boolean} reset
   * @returns {Promise<void>}
   */
  public async getWatchlistTv(order = '', orderBy = '', search = '', ratings = '', years = '', reset= false) {
    if (reset) {
      this.currentTvPageID = 1
    }
    await this.getWatchlistServerTv(order, orderBy, search, 1, ratings, years )
    while (this.tvPageID < this.currentTvPageID) {
      this.tvPageID++
      await this.getWatchlistServerTv(order, orderBy, search, this.tvPageID , ratings , years ,  true )
    }
    this.loadButton = this.currentTvPageID < this.tvMaxPageID ? true : false
  }

  /**
   * Dose the get watchlist movie call
   * @param {string} order
   * @param {string} orderBy
   * @param {string} search
   * @param {number} page
   * @param {string} ratings
   * @param {string} years
   * @param {boolean} append
   * @returns {Promise<void>}
   */
  private async getWatchlistServerMovie(order = '', orderBy = '', search = '', page = 1, ratings = '', years = '', append = false ) {
    try {
      const response = await this.http.get(this.URL + '/movie', {
        params: {
          page: page,
          order: order,
          orderBy: orderBy,
          search: search,
          years: years,
          ratings: ratings
        }
      }).toPromise()
      if (response.status === 200) {
        this.reconfigure(response.json(), 'movie', append)
      }
    } catch (err) {
      console.error(err)
    }
  }

  /**
   * Gets the watchlisttv from server
   * @param {string} order
   * @param {string} orderBy
   * @param {string} search
   * @param {number} page
   * @param {string} ratings
   * @param {string} years
   * @param {boolean} append
   * @returns {Promise<void>}
   */
  private async getWatchlistServerTv(order = '', orderBy = '', search = '', page = 1, ratings = '', years = '', append = false ) {
    try {
      const response = await this.http.get(this.URL + '/tv', { params: {
        page: page,
        order: order,
        orderBy: orderBy,
        search: search,
        years: years,
        ratings: ratings
      }}).toPromise()
      if (response.status === 200) {
        this.reconfigure(response.json(), 'tv', append)
      }
    } catch (err) {
      console.error(err)
    }
  }

  /**
   * creates cardElements from the response
   * @param json
   * @param type
   * @param {boolean} append
   */
  private reconfigure(json, type, append = false) {
    switch (type) {
      case('movie'):
        this.moviePageID = json.page
        this.movieMaxPageID = json.pageCount
        const watchlistMovie = json.docs.map((result) => {
          result.media_type = 'movie'
          result.watchlist = true
          return new CardElement(result)
        })
        if (append) {
          this.watchlistMovie = this.watchlistMovie.concat(watchlistMovie)
        } else {
          this.watchlistMovie = watchlistMovie
        }
        break
      case('tv'):
        this.tvPageID = json.page
        this.tvMaxPageID = json.pageCount
        const watchlistTv = json.docs.map((result) => {
          result.media_type = 'tv'
          result.watchlist = true
          return new CardElement(result)
        })
        if (append) {
          this.watchlistTv = this.watchlistTv.concat(watchlistTv)
        } else {
          this.watchlistTv = watchlistTv
        }
        break
    }
  }

  /**
   * Function is called to get the nect page
   * @param type
   * @param {string} order
   * @param {string} orderBy
   * @param {string} search
   * @param {string} ratings
   * @param {string} years
   * @returns {Promise<void>}
   */
  public async getNext(type, order = '', orderBy = '', search = '', ratings = '', years = '') {
    if ( type === 'movie') {
      this.moviePageID++
      this.currentMoviePageID++
      await this.getWatchlistServerMovie(order, orderBy, search, this.moviePageID , ratings, years, true )
      this.loadButton =  this.currentMoviePageID < this.movieMaxPageID ? true : false
    } else {
      this.tvPageID++
      this.currentTvPageID++
      await this.getWatchlistServerTv(order, orderBy, search, this.tvPageID , ratings, years, true )
      this.loadButton =  this.currentTvPageID < this.tvMaxPageID ? true : false
    }
  }

  /**
   * Checks if watchlist is empty
   * @param type
   * @returns {boolean}
   */
  public isEmpty(type): boolean {
    switch (type) {
      case 'movie': {
        if (!this.watchlistMovie) { return true }
        if (!this.watchlistMovie.length) { return true }
        return false
      }
      case 'tv': {
        if (!this.watchlistTv) { return true }
        if (!this.watchlistTv.length) { return true }
        return false
      }
      default: {
        return false
      }
    }
  }

  /**
   * Toggles between listView and gridView.
   */
  toggleListView() {
    this.listView = !this.listView
  }
}
