import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemsRoutingModule } from './items-routing.module';
import { ItemsComponent } from './items.component';
import { ModalModule } from 'ngx-bootstrap/modal';

import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NbCardModule, NbTreeGridModule, NbIconModule, NbInputModule, NbSelectModule, NbButtonModule, NbDatepickerModule, NbTooltipModule } from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { ItemRegisterComponent } from './item-register/item-register.component';
import { ItemFilterComponent } from './item-filter/item-filter.component';
import { ItemFormComponent } from './item-form/item-form.component';
import { ItemSceneComponent } from './item-scene/item-scene.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../shared/shared.module';
import { DevExtremeModule } from 'devextreme-angular';
import { PlyrModule } from 'ngx-plyr';

@NgModule({
  declarations: [
    ItemsComponent,
    ItemRegisterComponent,
    ItemFilterComponent,
    ItemFormComponent,
    ItemSceneComponent
  ],

  imports: [
    CommonModule,
    ItemsRoutingModule,
    // Ng2SmartTableModule,
    DevExtremeModule,
    NbCardModule, NbTreeGridModule, NbIconModule, NbInputModule,
    ThemeModule,
    NbSelectModule,
    NbButtonModule,
    NbDatepickerModule,
    NbTooltipModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    ModalModule.forRoot(),
    SharedModule,
    PlyrModule,
  

  ]
})
export class ItemsModule { }
