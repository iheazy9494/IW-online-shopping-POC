import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CharacterFilterComponent } from './character-filter/character-filter.component';
import { CharactersComponent } from './characters.component';
import { CharacterCreateComponent } from './character-create/character-create.component';

const routes: Routes = [
  {
    path: '', component: CharactersComponent,
    children: [
      // { path: '', redirectTo: 'character-filter' },
      { path: 'character-filter', component: CharacterFilterComponent },
      { path: 'character-create', component: CharacterCreateComponent },
      { path: 'character-edit/:id', component: CharacterCreateComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CharactersRoutingModule { }
