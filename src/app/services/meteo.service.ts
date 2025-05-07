import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MeteoService {

  constructor(private http: HttpClient) { }

  getWheaterLocation(lat: string, log: string) {
    return this.http.get<Location[]>(`${environment.baseUrl}?key=${environment.key}&q=${lat},${log}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getLocationPosition(pos: string) {
    return this.http.get<Location[]>(`${environment.baseUrl}?key=${environment.key}&q=${pos}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 400) {
      return throwError('Location not found');
    } else {
      return throwError('An error occurred');
    }
  }
}
