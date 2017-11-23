import { Component, OnInit, Input } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { LibraryService } from 'services/library/library.service'
import { WatchlistService } from 'services/watchlist/watchlist.service'
@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  @Input() childOf: any
  service: any
  url: string
  type: string
  nameSort: string
  nameArrow: string
  ratingSort: string
  ratingArrow: string
  dateSort: string
  dateArrow: string
  searchValue: string
  currentSort: string
  highlightedDiv: number
  toRating: number
  fromRating: number
  toDate: number
  fromDate: number

  constructor(
    private libraryService: LibraryService,
    private watchlistService: WatchlistService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private route: ActivatedRoute

  ) {
    this.type = 'movie'
    }

  ngOnInit() {
    this.url = this.router.url
    this.dateSort = 'release_date'
    this.ratingSort = 'vote_average'
    this.nameSort = 'title'
    this.highlightedDiv = 1
    this.currentSort = this.nameSort
    this.nameArrow = 'up'

    if (this.childOf === 'library') {
      this.service = this.libraryService
    } else if (this.childOf === 'watchlist') {
      this.service = this.watchlistService
    }
  }

  /**
   * Sets the stype, move or tv.
   * @param type
   */
  setType(type) {
    this.type = type
    this.nameSort = 'title'
    this.nameArrow = ''
    this.ratingSort = 'vote_average'
    this.ratingArrow = ''
    this.dateSort = 'release_date'
    this.dateArrow = ''
    this.searchValue = ''
    this.setQueryParms()
    this.currentSort = this.nameSort
    this.nameArrow = 'up'
  }

  /**
   * Toggeels the name button
   */
  toggleNameSort() {
    this.dateArrow = ''
    this.ratingArrow = ''
    if (this.nameSort === 'title') {
      this.nameArrow = 'down'
      this.nameSort = '-title'
    } else {
      this.nameSort = 'title'
      this.nameArrow = 'up'
    }
    this.currentSort = this.nameSort
    this.setQueryParms()
  }

  /**
   * Toggeels the rating button
   */
  toggleRatingSort() {
    this.nameArrow = ''
    this.dateArrow = ''
    if (this.ratingSort === 'vote_average') {
      this.ratingSort = '-vote_average'
      this.ratingArrow = 'down'
    } else {
      this.ratingSort = 'vote_average'
      this.ratingArrow = 'up'
    }
    this.currentSort = this.ratingSort
    this.setQueryParms()
  }
  /**
   * Toggeels the date button
   */
  toggleDateSort() {
    this.nameArrow = ''
    this.ratingArrow = ''
    if (this.dateSort === 'release_date') {
      this.dateSort = '-release_date'
      this.dateArrow = 'down'
    } else {
      this.dateSort = 'release_date'
      this.dateArrow = 'up'
    }
    this.currentSort = this.dateSort
    this.setQueryParms()
  }
  onSearchChange(event) {
    this.searchValue = event
    this.setQueryParms()
  }
  setQueryParms() {
    const queryParams = Object.assign({}, this.activatedRoute.snapshot.queryParams)
    queryParams['type'] = this.type
    queryParams['orderBy'] = this.currentSort
    queryParams['search'] = this.searchValue
    queryParams['years'] = this.fromDate + '-' + this.toDate
    queryParams['ratings'] = this.fromRating + '-' + this.toRating
    this.router.navigate([this.url], { queryParams: queryParams })
  }
  toggleHighlight(newValue: number) {
    if (this.highlightedDiv === newValue) {
      this.highlightedDiv = 0
    } else {
      this.highlightedDiv = newValue
    }
  }
  onDateToChange(event) {
    this.toDate = event || ''
    this.setQueryParms()
  }
  onDateFromChange(event) {
    this.fromDate = event || ''
    this.setQueryParms()
  }
  onRatingFromChange(event) {
    this.fromRating = event || ''
    this.setQueryParms()
  }
  onRatingToChange(event) {
    this.toRating = event || ''
    this.setQueryParms()
  }
}
