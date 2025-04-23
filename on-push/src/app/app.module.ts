import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {HeaderComponent} from "./header/header.component";
import {MainComponent} from "./main/main.component";
import {FilterComponent} from "./header/filter/filter.component";
import {ProfileComponent} from "./main/profile/profile.component";
import {ButtonComponent} from "./header/button/button.component";
import {ReferenceComponent} from "./reference/reference.component";
import {DetailsComponent} from "./main/details/details.component";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainComponent,
    FilterComponent,
    ProfileComponent,
    ButtonComponent,
    ReferenceComponent,
    DetailsComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
