import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MalayalamComponent } from './malayalam.component';

describe('MalayalamComponent', () => {
  let component: MalayalamComponent;
  let fixture: ComponentFixture<MalayalamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MalayalamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MalayalamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
