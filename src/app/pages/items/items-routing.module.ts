import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemsComponent } from './items.component';
import { ItemFilterComponent } from './item-filter/item-filter.component';
import { ItemRegisterComponent } from './item-register/item-register.component';

const routes: Routes = [
  {
    path: '', component: ItemsComponent,
    children: [
      // { path: '', redirectTo: 'item-filter' },
      { path: 'item-filter', component: ItemFilterComponent },
      { path: 'item-register', component: ItemRegisterComponent },
      { path: "item-edit/:id", component: ItemRegisterComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemsRoutingModule { }
