import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListmoviecardComponent } from './listmoviecard.component';

describe('ListmoviecardComponent', () => {
  let component: ListmoviecardComponent;
  let fixture: ComponentFixture<ListmoviecardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListmoviecardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListmoviecardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
