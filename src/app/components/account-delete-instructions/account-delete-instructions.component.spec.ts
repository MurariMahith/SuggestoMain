import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountDeleteInstructionsComponent } from './account-delete-instructions.component';

describe('AccountDeleteInstructionsComponent', () => {
  let component: AccountDeleteInstructionsComponent;
  let fixture: ComponentFixture<AccountDeleteInstructionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountDeleteInstructionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountDeleteInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
