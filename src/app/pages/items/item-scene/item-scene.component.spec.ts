import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemSceneComponent } from './item-scene.component';

describe('ItemSceneComponent', () => {
  let component: ItemSceneComponent;
  let fixture: ComponentFixture<ItemSceneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemSceneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemSceneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
