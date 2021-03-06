import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { AverageRatingComponent } from './average-rating.component'
import { LibraryService } from '../../services/library/library.service'
import { HttpModule } from '@angular/http'

describe('AverageRatingComponent', () => {
  let component: AverageRatingComponent
  let fixture: ComponentFixture<AverageRatingComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule
      ], declarations: [
        AverageRatingComponent
      ], providers: [
        LibraryService
      ]
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AverageRatingComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should contain a div', async(() => {
    fixture.detectChanges()
    const compiled = fixture.debugElement.nativeElement
    expect(compiled.querySelectorAll('div')).not.toBe(null)
  }))
})
