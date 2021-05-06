import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalisedMoviesComponent } from './personalised-movies.component';

describe('PersonalisedMoviesComponent', () => {
  let component: PersonalisedMoviesComponent;
  let fixture: ComponentFixture<PersonalisedMoviesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalisedMoviesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalisedMoviesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
