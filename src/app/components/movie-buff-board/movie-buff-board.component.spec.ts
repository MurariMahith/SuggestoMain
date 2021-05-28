import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieBuffBoardComponent } from './movie-buff-board.component';

describe('MovieBuffBoardComponent', () => {
  let component: MovieBuffBoardComponent;
  let fixture: ComponentFixture<MovieBuffBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovieBuffBoardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MovieBuffBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
