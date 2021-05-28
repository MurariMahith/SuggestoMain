import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TmdbMovieComponent } from './tmdb-movie.component';

describe('TmdbMovieComponent', () => {
  let component: TmdbMovieComponent;
  let fixture: ComponentFixture<TmdbMovieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TmdbMovieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TmdbMovieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
