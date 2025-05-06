import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MeteoService {

  constructor(private http: HttpClient) { }

  async getWheaterLocation(lat:string,log:string){
    console.log(this.http.get<Location[]>(`${environment.baseUrl}?key=${environment.key}&q=${lat},${log}`));
    return this.http.get<Location[]>(`${environment.baseUrl}?key=${environment.key}&q=${lat},${log}`);
  }
}
