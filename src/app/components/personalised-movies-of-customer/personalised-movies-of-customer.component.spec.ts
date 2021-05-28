import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalisedMoviesOfCustomerComponent } from './personalised-movies-of-customer.component';

describe('PersonalisedMoviesOfCustomerComponent', () => {
  let component: PersonalisedMoviesOfCustomerComponent;
  let fixture: ComponentFixture<PersonalisedMoviesOfCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalisedMoviesOfCustomerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalisedMoviesOfCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
