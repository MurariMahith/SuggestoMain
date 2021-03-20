import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalisationComponent } from './personalisation.component';

describe('PersonalisationComponent', () => {
  let component: PersonalisationComponent;
  let fixture: ComponentFixture<PersonalisationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalisationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
