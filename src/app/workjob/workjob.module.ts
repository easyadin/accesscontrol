import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WorkjobPageRoutingModule } from './workjob-routing.module';

import { WorkjobPage } from './workjob.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WorkjobPageRoutingModule
  ],
  declarations: [WorkjobPage],
  providers: [DatePipe]
})
export class WorkjobPageModule { }
