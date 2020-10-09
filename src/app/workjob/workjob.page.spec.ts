import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WorkjobPage } from './workjob.page';

describe('WorkjobPage', () => {
  let component: WorkjobPage;
  let fixture: ComponentFixture<WorkjobPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkjobPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkjobPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
