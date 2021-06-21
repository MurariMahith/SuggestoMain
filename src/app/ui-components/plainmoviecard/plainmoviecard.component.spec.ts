import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlainmoviecardComponent } from './plainmoviecard.component';

describe('PlainmoviecardComponent', () => {
  let component: PlainmoviecardComponent;
  let fixture: ComponentFixture<PlainmoviecardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlainmoviecardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlainmoviecardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
