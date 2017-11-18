import { Injectable } from '@angular/core'
import { Http } from '@angular/http'

import { CardElement } from 'classes/CardElement'


@Injectable()
export class WatchlistService {
  private URL = '/api/watchlist'
  watchlistMovie: any
  watchlistTv: any

  constructor(private http: Http) {}

  public async addToWatchlist(element: CardElement) {
    const type = element.type
    const id = element.id
    try {
      const response = await this.http.post(this.URL + '/' + type, {id: id}).toPromise()
    } catch (err) {
      console.error(err)
    }
  }
  public async removeFromWatchlist(element: CardElement) {
    const type = element.type
    const id = element.id
    try {
      const response = await this.http.delete(this.URL + '/' + type + '/remove/' + id).toPromise()
    } catch (err) {
      console.error(err)
    }
  }
  public async getWatchlist() {
    try {
      const response = await this.http.get(this.URL + '/movie/').toPromise()
      if (response.status === 200) {
        this.reconfigure(response.json(), 'movie')
      }
    }catch (err) {
      console.error(err)
    }
    try {
      const response = await this.http.get(this.URL + '/tv/').toPromise()
      if (response.status === 200) {
        this.reconfigure(response.json(), 'tv')
      }
    }catch (err) {
      console.error(err)
    }
  }

  private reconfigure(json, type) {
    switch (type) {
      case('movie'):
        this.watchlistMovie = json.map((result) => new CardElement(result))
        break
      case('tv'):
        this.watchlistTv = json.map((result) => new CardElement(result))
        break
    }
  }
}
