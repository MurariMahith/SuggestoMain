import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomMoviesComponent } from './random-movies.component';

describe('RandomMoviesComponent', () => {
  let component: RandomMoviesComponent;
  let fixture: ComponentFixture<RandomMoviesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RandomMoviesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RandomMoviesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
