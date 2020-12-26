import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsFitComponent } from './items-fit.component';

describe('ItemsFitComponent', () => {
  let component: ItemsFitComponent;
  let fixture: ComponentFixture<ItemsFitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemsFitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsFitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
