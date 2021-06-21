import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallInIOSComponent } from './install-in-ios.component';

describe('InstallInIOSComponent', () => {
  let component: InstallInIOSComponent;
  let fixture: ComponentFixture<InstallInIOSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstallInIOSComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstallInIOSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
