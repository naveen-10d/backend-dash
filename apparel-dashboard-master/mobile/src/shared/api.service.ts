import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError } from 'rxjs/operators/catchError';

@Injectable()
export class ApiService {
  constructor(
    private http: HttpClient
  ) {}

  private setHeaders(): HttpHeaders {
    const headersConfig = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    return new HttpHeaders(headersConfig);
  }

  private formatErrors(httpresponse: any) {
    // console.log(httpresponse);
    return new ErrorObservable(httpresponse);
  }

  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http.get(`${path}`,
      {
        headers: this.setHeaders(),
        params
      })
      .pipe(catchError(this.formatErrors));
  }

  put(path: string, body: Object = {}): Observable<any> {
    return this.http.put(
      `${path}`,
      JSON.stringify(body),
      { headers: this.setHeaders() }
    ).pipe(catchError(this.formatErrors));
  }

  post(path: string, body: Object = {}): Observable<any> {
    return this.http.post(
      `${path}`,
      JSON.stringify(body),
      {
        headers: this.setHeaders()
      }
    ).pipe(catchError(this.formatErrors));
  }

  delete(path): Observable<any> {
    return this.http.delete(
      `${path}`,
      { headers: this.setHeaders() }
    ).pipe(catchError(this.formatErrors));
  }
}
