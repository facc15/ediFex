import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';

import { DashboardPage } from './dashboard.page';
import { ThingsPageModule } from '../things/things.module';
import { SpinnerModule } from 'src/app/Components/spinner/spinner.module';
import { OptionsPageModule } from '../options/options.module';
import { ChartPageModule } from '../chart/chart.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardPageRoutingModule,
    ThingsPageModule,
    SpinnerModule,
    OptionsPageModule,
    ChartPageModule
  ],
  declarations: [DashboardPage]
})
export class DashboardPageModule {}
