import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

export interface TimeIcon {
  time: string;
  icon: string;
}


@Injectable({
  providedIn: 'root'
})
export class MeteoService {

  constructor(private http: HttpClient) { }

  getWheaterLocation(lat: string, lon: string) {
    return this.http.get<Location[]>(`${environment.baseUrl}current.json?key=${environment.key}&q=${lat},${lon}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getLocationPosition(pos: string) {
    return this.http.get<Location[]>(`${environment.baseUrl}current.json?key=${environment.key}&q=${pos}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getHourLocationWheather(lat:string,lon:string,date: string): Observable<TimeIcon[]>{
    const url = `${environment.baseUrl}future.json?key=${environment.key}&q=${lat},${lon}&dt=${date}`;
    return this.http.get<any>(url).pipe(
      map(response => {
        return response.forecast.forecastday[0].hour.map((hour: any) => ({
          time: hour.time,
          icon: hour.condition.icon
        }));
      }),
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
