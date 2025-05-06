import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { MeteoService } from 'src/app/services/meteo.service';
@Component({
  selector: 'app-home',
  standalone:false,
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  weatherData: any;
  coordinate: any = {};
  constructor(private meteoService: MeteoService) { }

  async ngOnInit() {
    Geolocation.getCurrentPosition().then(async data => {
      this.coordinate = {
        latitude: data.coords.latitude,
        longitude: data.coords.longitude
      };
      await this.getPosition();
    })
  }

  async getPosition(): Promise<void> {
    (await this.meteoService.getWheaterLocation(this.coordinate.latitude,this.coordinate.longitude)).subscribe(data =>{
      this.weatherData = data;
    });
  }

}
