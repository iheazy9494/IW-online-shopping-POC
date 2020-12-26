import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterSceneComponent } from './character-scene/character-scene.component';
import { NgxIndexedDBModule, DBConfig } from 'ngx-indexed-db';
import { NbToggleModule, NbTooltipModule } from '@nebular/theme';

const dbConfig: DBConfig = {
  name: 'MyDb',
  version: 1,
  objectStoresMeta: [{
    store: 'characters',
    storeConfig: { keyPath: 'name', autoIncrement: true },
    storeSchema: [
      // { name: 'ss', keypath: 'name', options: { unique: false } },
      // { name: 'ss', keypath: 'file', options: { unique: false } }
    ],
  }],
};

@NgModule({
  declarations: [CharacterSceneComponent],
  imports: [
    CommonModule,
    NgxIndexedDBModule.forRoot(dbConfig),
    NbToggleModule,
    NbTooltipModule
  ],
  exports: [CharacterSceneComponent],
})
export class SharedModule { }
