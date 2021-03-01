import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KannadaComponent } from './kannada.component';

describe('KannadaComponent', () => {
  let component: KannadaComponent;
  let fixture: ComponentFixture<KannadaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KannadaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KannadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
