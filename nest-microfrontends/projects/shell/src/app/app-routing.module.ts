import { HiModule } from './../../../mf1/src/app/hi/hi.module';
import { HiComponent } from './../../../mf1/src/app/hi/hi.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShellComponent } from './shell/shell.component';

const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
  },
  {
    path: 'mf1',
    loadChildren: () => import('mf/HiModule').then(m => m.HiModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
