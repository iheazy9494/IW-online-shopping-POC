import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterSceneComponent } from './character-scene.component';

describe('CharacterSceneComponent', () => {
  let component: CharacterSceneComponent;
  let fixture: ComponentFixture<CharacterSceneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharacterSceneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterSceneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
