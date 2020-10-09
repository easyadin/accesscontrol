import { newWork, Work, User, workDetail } from './../models/work';
import { DbService } from './../services/db.service';
import { Component, NgZone, OnDestroy, OnInit, ViewChild, AfterViewInit, Inject, LOCALE_ID } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { IonInput, ToastController } from '@ionic/angular';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy, AfterViewInit {
  constructor(@Inject(LOCALE_ID) private locale: string, private datePipe: DatePipe, private ngZone: NgZone, private toast: ToastController, private dbService: DbService, private router: Router) { }

  @ViewChild('homeInput') homeInput: IonInput;

  isFullscreen = false;

  // last operation details
  lastOperation: Work;
  detail: workDetail;

  lastOperationSub: Subscription;

  prompt: string;

  scanResult: string = "";

  enter_1 = 7;
  enter_2 = 13;

  exit_1 = 11; // day
  exit_2 = 16; // noon

  // TODO: use 24hrs time format
  currentDate = new Date;

  currentHour = this.currentDate.getHours();
  accessStatus = 'Exit';

  trackTime = true;

  ngOnInit(): void {
    this.ngZone.run(() => {
      // TODO: force focus on input -- still not working
      setTimeout(() => {
        this.homeInput.setFocus()
      }, 100)
    })

    // track last
    this.lastOperationSub = this.dbService.lastOperationChanged.subscribe((lastOp) => {
      this.lastOperation = lastOp;

      console.log(this.lastOperation)

      // get user
      this.dbService.getUser(this.lastOperation.workUserCode).subscribe((res) => {
        this.detail = res[0]
        console.log(this.detail)
      })

      if (this.lastOperation.workPhaseCode !== null) {
        // get work phase
        this.dbService.getPhase(this.lastOperation.workPhaseCode).subscribe((res) => {
          this.lastOperation.enterExit = res[0].description
          console.log(this.detail)
        })
      }
    })

    // set time
    setInterval(() => {
      this.currentDate = new Date;
      this.onCheckout(this.trackTime);
    }, 10000)
  }

  ngAfterViewInit() {
    this.ngZone.run(() => {
      // TODO: force focus on input -- still not working
      setTimeout(() => {
        this.homeInput.setFocus()
      }, 100)
    })
  }


  ionViewDidEnter() {
    this.homeInput.setFocus();
  }

  onCheckout(value) {
    // time of day constraints
    switch (value) {
      case (this.currentHour >= this.enter_1 && this.currentHour <= this.exit_1):
        this.accessStatus = "Enter";
        break;
      case (this.currentHour > this.exit_1 && this.currentHour <= this.enter_2):
        this.accessStatus = "Exit";
        break;
      case (this.currentHour >= this.enter_2 && this.currentHour <= this.exit_2):
        this.accessStatus = "Enter";
        break;
      case (this.currentHour > this.exit_2 || this.currentHour <= this.enter_1):
        this.accessStatus = "Exit";
        break;
      default:
        console.log('invalid numbers');
    }
  }

  onTap() {
    console.log("tapped")
    this.accessStatus === "Enter" ? this.accessStatus = "Exit" : this.accessStatus = "Enter";
  }

  onScan(event) {
    this.scanResult = event.target.value;

    let scanned = this.scanResult.split('');
    console.log(scanned)

    // check if code is user code or job code
    if (scanned[0] == "U") {
      // check user exist
      this.dbService.getUser(this.scanResult).subscribe((res) => {
        console.log(res)
        if (res[0]) {
          // record the user barcode to workTable [usercode, enterExist,dataTime]
          let newWork: newWork = {
            dateTime: this.datePipe.transform(Date.now(), 'yyyy-MM-dd HH:mm:s', this.locale),
            enterExit: this.accessStatus,
            workJobCode: null,
            workPhaseCode: null,
            workUserCode: this.scanResult
          }

          this.dbService.addWork(newWork).subscribe((res) => {
            console.log(res)

            // set last operation
            this.lastOperation = newWork;
            this.dbService.setLastOperation(newWork);
            this.presentToast();

            this.scanResult = ''
          })
        }
      })
    }
    else if (scanned[0] == "J") {
      // check job exist
      // check user exist
      this.dbService.getJob(this.scanResult).subscribe((res) => {
        console.log(res)
        // job exist
        if (res[0]) {
          // router to Job page
          this.router.navigate(["/", "workjob", this.scanResult])
          this.scanResult = ''
        }
      })
    }

    else {
      this.scanResult = '';
      event.target.value = '';
    }
  }

  async presentToast() {
    const toast = await this.toast.create({
      message: "Successful",
      duration: 2000
    });
    toast.present();
  }


  ngOnDestroy(): void {
    this.lastOperationSub.unsubscribe();
  }

  elem = document.documentElement;

  openFullscreen() {
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen().then(() => {
        this.isFullscreen = true;
      });
    }
    //else if (this.elem.mozRequestFullScreen) {
    //   /* Firefox */
    //   this.elem.mozRequestFullScreen();
    // } else if (this.elem.webkitRequestFullscreen) {
    //   /* Chrome, Safari and Opera */
    //   this.elem.webkitRequestFullscreen();
    // } else if (this.elem.msRequestFullscreen) {
    //   /* IE/Edge */
    //   this.elem.msRequestFullscreen();
    // }

    this.homeInput.setFocus()
  }

  /* Close fullscreen */
  closeFullscreen() {
    document.exitFullscreen();
    this.isFullscreen = false;

    this.homeInput.setFocus()
  }
}
