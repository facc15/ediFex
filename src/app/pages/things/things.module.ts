import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ThingsPageRoutingModule } from './things-routing.module';

import { ThingsPage } from './things.page';
import { SpinnerComponent } from 'src/app/Components/spinner/spinner.component';
import { SpinnerModule } from 'src/app/Components/spinner/spinner.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ThingsPageRoutingModule,
    SpinnerModule
  ],
  declarations: [ThingsPage],
  exports:[ThingsPage]
})
export class ThingsPageModule {}
