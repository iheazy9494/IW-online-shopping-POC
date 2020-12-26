import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResendVerifyCodeComponent } from './resend-verify-code.component';

describe('ResendVerifyCodeComponent', () => {
  let component: ResendVerifyCodeComponent;
  let fixture: ComponentFixture<ResendVerifyCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResendVerifyCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResendVerifyCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
