import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';


const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'characters',
      loadChildren: () => import('./characters/characters.module')
        .then(m => m.CharactersModule),
    },
    {
      path: 'items',
      loadChildren: () => import('./items/items.module')
        .then(m => m.ItemsModule)
    },
    {
      path: 'allocation',
      loadChildren: () => import('./allocation/allocation.module')
        .then(m => m.AllocationModule)
    },
    {
      path: 'miscellaneous',
      loadChildren: () => import('./miscellaneous/miscellaneous.module')
        .then(m => m.MiscellaneousModule),
    },
    {
      path: '',
      redirectTo: 'characters/character-filter',
      pathMatch: 'full',
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
