import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HiComponent } from './hi.component';

const routes: Routes = [
  {
    path: '',
    component: HiComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HiRoutingModule { }
