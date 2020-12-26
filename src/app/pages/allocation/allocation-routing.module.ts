import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllocationComponent } from './allocation.component';
import { AllocationSceneComponent } from './allocation-scene/allocation-scene.component';

const routes: Routes = [
  {
    path: '', component: AllocationComponent, children: [
      { path: 'allocation-scene', component: AllocationSceneComponent },
      { path: 'allocation-scene/:id', component: AllocationSceneComponent },
    ]
  }
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllocationRoutingModule { }
