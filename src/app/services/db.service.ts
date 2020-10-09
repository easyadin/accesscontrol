import { newWork, Phase, Work } from './../models/work';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Job, User } from '../models/work';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  constructor(private http: HttpClient) { }

  lastOperationChanged = new Subject<Work>();

  setLastOperation(work) {
    this.lastOperationChanged.next(work);
  }

  readonly APIURL = "http://localhost:8090/api/";

  // get all works
  getWorks(): Observable<User[]> {
    return this.http.get<any>(this.APIURL + '/worktable');
  }

  // get all users
  getUsers(): Observable<User[]> {
    return this.http.get<any>(this.APIURL + '/workuser');
  }

  // get users by code
  getUser(code): Observable<User> {
    return this.http.get<any>(this.APIURL + '/workuser/' + code);
  }

  // get jobs id
  getJobs(): Observable<Job[]> {
    return this.http.get<any>(this.APIURL + '/workjob');
  }

  // get user by code
  getJob(code): Observable<Job> {
    // console.log(code)
    return this.http.get<any>(this.APIURL + '/workjob/' + code);
  }

  // get user by code
  getPhase(code): Observable<Phase> {
    // console.log(code)
    return this.http.get<any>(this.APIURL + '/workphase/' + code);
  }

  // add work
  addWork(work: newWork) {
    return this.http.post(this.APIURL + '/worktable', work)
  }
}
