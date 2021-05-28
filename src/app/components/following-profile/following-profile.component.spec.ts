import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowingProfileComponent } from './following-profile.component';

describe('FollowingProfileComponent', () => {
  let component: FollowingProfileComponent;
  let fixture: ComponentFixture<FollowingProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowingProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowingProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
