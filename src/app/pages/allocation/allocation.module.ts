import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllocationRoutingModule } from './allocation-routing.module';
import { AllocationComponent } from './allocation.component';


import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NbCardModule, NbTreeGridModule, NbIconModule, NbInputModule, NbButtonModule } from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { ItemsFitComponent } from './items-fit/items-fit.component';
import { AllocationSceneComponent } from './allocation-scene/allocation-scene.component';
import { SharedModule } from '../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
//import { CharacterSceneComponent } from '../characters/character-scene/character-scene.component';
//import { CharacterSceneComponent } from '../character-scene/character-scene.component'
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [
    AllocationComponent,
    ItemsFitComponent,
    AllocationSceneComponent],

  imports: [
    CommonModule,
    AllocationRoutingModule,
    Ng2SmartTableModule,
    NbCardModule, NbTreeGridModule, NbIconModule, NbInputModule,
    ThemeModule,
    SharedModule,
    NgSelectModule,
    NbButtonModule,
    FormsModule,
    ModalModule.forRoot(),
  ]
})
export class AllocationModule { }
