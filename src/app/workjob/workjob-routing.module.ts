import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkjobPage } from './workjob.page';

const routes: Routes = [
  {
    path: '',
    component: WorkjobPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkjobPageRoutingModule {}
