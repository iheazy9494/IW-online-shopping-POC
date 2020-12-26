import { NgModule } from '@angular/core';
import { NbMenuModule, NbIconModule, NbIconLibraries } from '@nebular/theme';

import { CharactersModule } from './characters/characters.module'
import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { AllocationModule } from './allocation/allocation.module';
import { SharedModule } from './shared/shared.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';


@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    CharactersModule,
    AllocationModule,
    SharedModule,
    MiscellaneousModule,
    NbIconModule
  ],
  declarations: [
    PagesComponent
  ],
})
export class PagesModule {
}