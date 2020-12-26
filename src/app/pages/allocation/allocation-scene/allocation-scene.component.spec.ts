import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocationSceneComponent } from './allocation-scene.component';

describe('AllocationSceneComponent', () => {
  let component: AllocationSceneComponent;
  let fixture: ComponentFixture<AllocationSceneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllocationSceneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllocationSceneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
