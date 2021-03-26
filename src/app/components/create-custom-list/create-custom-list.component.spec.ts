import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCustomListComponent } from './create-custom-list.component';

describe('CreateCustomListComponent', () => {
  let component: CreateCustomListComponent;
  let fixture: ComponentFixture<CreateCustomListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCustomListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCustomListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
