import { Job, Work } from './../models/work';
import { DbService } from './../services/db.service';
import { AfterViewInit, Component, ElementRef, Inject, Input, LOCALE_ID, NgZone, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { IonInput, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-workjob',
  templateUrl: './workjob.page.html',
  styleUrls: ['./workjob.page.scss'],
})
export class WorkjobPage implements OnInit, AfterViewInit {
  constructor(@Inject(LOCALE_ID) private locale: string, private datePipe: DatePipe, private router: Router, private toast: ToastController,
    private acRoute: ActivatedRoute, private ngZone: NgZone, private dbService: DbService) { }

  @ViewChild('userCodeInput') userCodeInput: IonInput;
  @ViewChild('phaseCodeInput') phaseCodeInput: IonInput;

  inputEvents: any[] = [];

  jobCode;
  workJob: Job;

  phaseCode: any = '';
  phaseDescription = '';

  userCode: any = false;
  userDescription = '';

  prompt = "Please Scan your Badge";

  ngOnInit() {
    this.startOver();

    // retrieve the job code
    this.acRoute.paramMap.subscribe((paramMap) => {
      if (paramMap.has('id')) {
        this.jobCode = paramMap.get('id');

        this.dbService.getJob(this.jobCode).subscribe((res) => {
          this.workJob = res[0];
        })
      }
    })

    this.ngZone.run(() => {
      // TODO: force focus on input -- still not working
      setTimeout(() => {
        this.userCodeInput.setFocus()
      }, 100)
    })
  }

  ngAfterViewInit() {
    this.ngZone.run(() => {
      // TODO: force focus on input -- still not working
      setTimeout(() => {
        this.userCodeInput.setFocus()
      }, 100)
    })
  }

  onUserCodeChanged(event) {
    console.log(event.target.value)
    // check if the user code is valid
    this.dbService.getUser(event.target.value).subscribe(
      (res) => {
        console.log(res[0])
        if (res[0]) {
          this.userCode = event.target.value;
          event.target.disabled = true;
          this.phaseCodeInput.setFocus();
          this.prompt = "Please Scan the Work Phase"


          // set user description from code
          this.userDescription = res[0].description;

          // track events
          this.inputEvents.push(event)
        }
        else {
          event.target.value = '';
          this.userCodeInput.setFocus();
        }
      },
      (error) => {
        console.log(error.status)
      }
    )
  }

  onPhaseCodeCodeChanged(event) {
    // check if the phase code is valid
    this.dbService.getPhase(event.target.value).subscribe(
      (res) => {
        console.log(res)

        if (res[0]) {
          this.phaseCode = event.target.value;

          // set user description from code
          this.phaseDescription = res[0].description;

          // submit information to db
          const newWork: Work = {
            dateTime: this.datePipe.transform(Date.now(), 'yyyy-MM-dd HH:mm:s', this.locale),
            enterExit: null,
            workJobCode: this.jobCode,
            workPhaseCode: this.phaseCode,
            workUserCode: this.userCode
          }

          console.log(newWork)

          this.dbService.addWork(newWork).subscribe((res) => {
            console.log(res)

            // set last operation
            this.dbService.setLastOperation(newWork);

            this.prompt = "Processing..."
            this.presentToast();

            // go back home
            this.router.navigateByUrl('/home');

            this.startOver();
          })
        }

        else {
          // clear input
          event.target.value = ''
        }
      },
      (error) => {
        console.log(error.status)
      }
    )
  }

  startOver() {
    this.userCode = '';
    this.phaseCode = '';
    this.userDescription = '';
    this.phaseDescription = '';
    this.prompt = "Please Scan your Badge";

    this.inputEvents.map(e => {
      e.target.value = '';
      e.target.disabled = false;

      setTimeout(() => {
        this.userCodeInput.setFocus();
      }, 100)
    })
  }

  async presentToast() {
    const toast = await this.toast.create({
      message: "Successful",
      duration: 2000
    });
    toast.present();
  }

}
