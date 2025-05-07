import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { Preferences } from '@capacitor/preferences';
import { MeteoService } from 'src/app/services/meteo.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  weatherData: any;
  coordinate: any = {};
  locations: any[] = [];

  constructor(private meteoService: MeteoService, private toastController: ToastController) { }

  async ngOnInit() {
    Geolocation.getCurrentPosition().then(async data => {
      this.coordinate = {
        latitude: data.coords.latitude,
        longitude: data.coords.longitude
      };
      await this.getPosition();
      this.getFavorites();
    });
  }

  async getPosition(): Promise<void> {
    this.meteoService.getWheaterLocation(this.coordinate.latitude, this.coordinate.longitude).subscribe(
      data => {
        this.weatherData = data;
      },
      async error => {
        const toast = await this.toastController.create({
          message: error,
          duration: 3000,
          position: 'bottom'
        });
        await toast.present();
      }
    );
  }

  async getFavorites(): Promise<void> {
    const favorite = await Preferences.get({ key: 'favorite' });
    console.log('Raw favorite data:', favorite);
    this.locations = favorite.value ? JSON.parse(favorite.value) : [];
    console.log('Parsed favorite locations:', this.locations);
  }

  getBackgroundClass(condition: string): string {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return 'sunny-bg';
      case 'rainy':
        return 'rainy-bg';
      case 'overcast':
        return 'cloudy-bg';
      case 'snow':
        return 'snow-bg';
      case 'partly cloudy':
        return 'partial-cloudy-bg';
      default:
        return 'default-bg';
    }
  }

}
