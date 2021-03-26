import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllSuggestedMoviesComponent } from './all-suggested-movies.component';

describe('AllSuggestedMoviesComponent', () => {
  let component: AllSuggestedMoviesComponent;
  let fixture: ComponentFixture<AllSuggestedMoviesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllSuggestedMoviesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllSuggestedMoviesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
