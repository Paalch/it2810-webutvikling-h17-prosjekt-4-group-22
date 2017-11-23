import { Injectable } from '@angular/core'
import { Http } from '@angular/http'

import { CardElement } from 'classes/CardElement'
import { isNullOrUndefined } from 'util'



@Injectable()
export class LibraryService {
  public listView = false
  public loadButton: boolean
  private URL = '/api/library'
  libraryMovie: CardElement[]
  libraryTv: CardElement[]
  moviePageID: number
  currentMoviePageID: number
  movieMaxPageID: number
  tvPageID: number
  currentTvPageID: number
  tvMaxPageID: number

  constructor(private http: Http) {
    this.moviePageID = 1
    this.libraryMovie = []
    this.currentMoviePageID = 1
    this.tvPageID = 1
    this.libraryTv = []
    this.currentTvPageID = 1
  }

  /**
   * Adds the choosen CardElement to the library.
   */
  public async addToLibrary(element: CardElement) {
    const type = element.type
    const id = element.id
    try {
      const response = await this.http.post(this.URL + '/' + type, {id: id}).toPromise()
    } catch (err) {
      console.error(err)
    }
  }

  /**
   * Removes the choosen CardElement from the library.
   */
  public async removeFromLibrary(element: CardElement) {
    const type = element.type
    const id = element.id
    try {
      const response = await this.http.delete(this.URL + '/' + type, { body: {id: id} }).toPromise()
      if (element.type === 'movie') {
        const index = this.libraryMovie.indexOf(element)
        if (index >= 0) {
          this.libraryMovie.splice(index, 1)
        }
      } else {
        const index = this.libraryTv.indexOf(element)
        if (index >= 0) {
          this.libraryTv.splice(index, 1)
        }
      }

    } catch (err) {
      console.error(err)
    }
  }

  /**
   * Gets the whole library from server
   * @param {string} order
   * @param {string} orderBy
   * @param {string} search
   * @param {string} ratings
   * @param {string} years
   * @param {boolean} reset
   * @returns {Promise<void>}
   */
  public async getLibrary(order = '', orderBy = '', search = '', ratings = '', years= '', reset= false) {
    this.getLibraryMovie(order, orderBy, search, ratings, years, reset)
    this.getLibraryTv(order, orderBy, search, ratings, years, reset)
  }

  /**
   * Loads the movies in library
   * @param {string} order
   * @param {string} orderBy
   * @param {string} search
   * @param {string} ratings
   * @param {string} years
   * @param {boolean} reset
   * @returns {Promise<void>}
   */
  public async getLibraryMovie(order = '', orderBy = '', search = '', ratings = '', years= '', reset= false) {
    if (reset) {
      this.currentMoviePageID = 1
    }
    await this.getLibraryServerMovie(order, orderBy, search,1, ratings, years)
    while (this.moviePageID < this.currentMoviePageID) {
      this.moviePageID++
      await this.getLibraryServerMovie(order, orderBy, search, this.moviePageID , ratings, years, true )
    }
    this.loadButton = this.currentMoviePageID < this.movieMaxPageID
  }

  /**
   * loads series to library
   * @param {string} order
   * @param {string} orderBy
   * @param {string} search
   * @param {string} ratings
   * @param {string} years
   * @param {boolean} reset
   * @returns {Promise<void>}
   */
  public async getLibraryTv(order = '', orderBy = '', search = '', ratings = '', years = '', reset= false) {
    if (reset) {
      this.currentTvPageID = 1
    }
    await this.getLibraryServerTv(order, orderBy, search, 1, ratings, years)
    while (this.tvPageID < this.currentTvPageID) {
      this.tvPageID++
      await this.getLibraryServerTv(order, orderBy, search, this.tvPageID , ratings , years, true )
    }
    this.loadButton = this.currentTvPageID < this.tvMaxPageID
  }

  /**
   * gets moveLibrary from server
   * @param {string} order
   * @param {string} orderBy
   * @param {string} search
   * @param {number} page
   * @param {boolean} append
   * @returns {Promise<void>}
   */
  private async getLibraryServerMovie(order = '', orderBy = '', search = '', page = 1, ratings = '', years= '', append = false ) {
    try {
      const response = await this.http.get(this.URL + '/movie', {
        params: {
          page: page,
          order: order,
          orderBy: orderBy,
          search: search,
          ratings: ratings,
          years: years
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
   * Gets the library tv from server
   * @param {string} order
   * @param {string} orderBy
   * @param {string} search
   * @param {number} page
   * @param {string} ratings
   * @param {string} years
   * @param {boolean} append
   * @returns {Promise<void>}
   */
  private async getLibraryServerTv(order = '', orderBy = '', search = '', page = 1, ratings = '', years= '', append = false ) {
    try {
      const response = await this.http.get(this.URL + '/tv', { params: {
        page: page,
        order: order,
        orderBy: orderBy,
        search: search,
        ratings: ratings,
        years: years
      }}).toPromise()
      if (response.status === 200) {
        this.reconfigure(response.json(), 'tv', append)
      }
    } catch (err) {
      console.error(err)
    }
  }

  /**
   * creates cardelements from the given data
   * @param json
   * @param type
   * @param {boolean} append
   */
  private reconfigure(json, type, append = false) {
    switch (type) {
      case('movie'):
        this.moviePageID = json.page
        this.movieMaxPageID = json.pageCount
        const libraryMovie = json.docs.map((result) => {
          result.media_type = 'movie'
          result.library = true
          return new CardElement(result)
        })
        if (append) {
          this.libraryMovie = this.libraryMovie.concat(libraryMovie)
        } else {
          this.libraryMovie = libraryMovie
        }
        break
      case('tv'):
        this.tvPageID = json.page
        this.tvMaxPageID = json.pageCount
        const libraryTv = json.docs.map((result) => {
          result.media_type = 'tv'
          result.library = true
          return new CardElement(result)
        })
        if (append) {
          this.libraryTv = this.libraryTv.concat(libraryTv)
        } else {
          this.libraryTv = libraryTv
        }
        break
    }
  }

  /**
   * Checks if the library lists are empty.
   */
  public isEmpty(type): boolean {
    switch (type) {
      case 'movie': {
        if (!this.libraryMovie) { return true }
        if (!this.libraryMovie.length) { return true }
        return false
      }
      case 'tv': {
        if (!this.libraryTv) { return true }
        if (!this.libraryTv.length) { return true }
        return false
      }
      default: {
        return false
      }
    }
  }

  /**
   * loads next page
   * @param type
   * @param {string} order
   * @param {string} orderBy
   * @param {string} search
   * @param {string} ratings
   * @param {string} years
   * @returns {Promise<void>}
   */
  public async getNext(type, order = '', orderBy = '', search = '', ratings = '', years= '') {
    if ( type === 'movie') {
      this.moviePageID++
      this.currentMoviePageID++
      await this.getLibraryServerMovie(order, orderBy, search, this.moviePageID , ratings, years, true )
      this.loadButton =  this.currentMoviePageID < this.movieMaxPageID
    } else {
      this.tvPageID++
      this.currentTvPageID++
      await this.getLibraryServerTv(order, orderBy, search, this.tvPageID , ratings , years, true )
      this.loadButton =  this.currentTvPageID < this.tvMaxPageID
    }
  }

  /**
   * Toggles between listView and gridView.
   */
  toggleListView() {
    this.listView = !this.listView
  }

}
