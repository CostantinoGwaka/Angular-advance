import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HiRoutingModule } from './hi-routing.module';
import { HiComponent } from './hi.component';


@NgModule({
  declarations: [
    HiComponent
  ],
  imports: [
    CommonModule,
    HiRoutingModule
  ]
})
export class HiModule { }
