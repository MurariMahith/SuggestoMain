import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandedmoviecardComponent } from './expandedmoviecard.component';

describe('ExpandedmoviecardComponent', () => {
  let component: ExpandedmoviecardComponent;
  let fixture: ComponentFixture<ExpandedmoviecardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpandedmoviecardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpandedmoviecardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
