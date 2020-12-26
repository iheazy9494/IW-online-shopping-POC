import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';



import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NbCardModule, NbTreeGridModule, NbIconModule, NbInputModule, NbButtonModule, NbSelectModule, NbToastrModule } from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { DevExtremeModule } from 'devextreme-angular';
import { SharedModule } from '../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';

import { CharactersRoutingModule } from './characters-routing.module';
import { CharactersComponent } from './characters.component';
import { CharacterFilterComponent } from './character-filter/character-filter.component';
import { CharacterFormComponent } from './character-form/character-form.component';
import { CharacterCreateComponent } from './character-create/character-create.component';
@NgModule({
  declarations: [
    CharactersComponent,
    CharacterFilterComponent,
    CharacterFormComponent,
    CharacterCreateComponent
  ],
  imports: [
    NbCardModule,
    NbTreeGridModule,
    NbButtonModule,
    NbSelectModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    // Ng2SmartTableModule,
    DevExtremeModule,
    CharactersRoutingModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    NbToastrModule.forRoot(),
  ]
})
export class CharactersModule { }
