import { Component, OnInit, OnDestroy } from '@angular/core'
import { LibraryService } from 'services/library/library.service'
import { ActivatedRoute, Router } from '@angular/router'


@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit, OnDestroy {
  type: string
  order: string
  orderBy: string
  search: string
  years: string
  ratings: string
  private sub: any
  getListElements: Function

  constructor(public libraryService: LibraryService,
              private route: ActivatedRoute,
              private router: Router
              ) {}

  async ngOnInit() {
    this.libraryService.getLibrary()
    this.sub = this.route.queryParams.subscribe(async (params) => {
        this.type = params['type'] || 'movie'
        this.orderBy = params['orderBy'] || 'title'
        this.search = params['search'] || ''
        this.years = params['years'] || ''
        this.ratings = params['ratings'] || ''
        if (this.type === 'movie') {
          await this.libraryService.getLibraryMovie(this.order, this.orderBy, this.search, this.ratings, this.years, true)
        } else {
          await this.libraryService.getLibraryTv(this.order, this.orderBy, this.search, this.ratings, this.years, true)
        }
      })
    await this.libraryService.getLibraryMovie(this.order, this.orderBy, this.search, this.ratings, this.years, true)
    this.getListElements = this.getList.bind(this)
  }
  ngOnDestroy() {
    this.sub.unsubscribe()
  }

  /**
   * Gets list with movies and tv from libraryService.
   */
  getList() {
    if (this.type === 'movie') {
      return this.libraryService.libraryMovie
    } else if (this.type === 'tv') {
      return this.libraryService.libraryTv
    }
  }
  async appendLibrary() {
    await this.libraryService.getNext(this.type, this.order, this.orderBy, this.search, this.ratings, this.years)
  }
}
