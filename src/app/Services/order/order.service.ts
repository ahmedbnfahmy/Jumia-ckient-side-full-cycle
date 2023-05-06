import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { Iorder } from 'src/app/Models/iorder';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  httpOptions = {};


  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }

  constructor(private http: HttpClient,public router: Router) { 
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
  }


  addUserOrder(data: any): Observable<Iorder> {
    return this.http.post<Iorder>(`${environment.jDBUrl}/api/order/createOrder`, data, this.httpOptions).pipe(
      catchError(this.handleError)
    )

  }




}
