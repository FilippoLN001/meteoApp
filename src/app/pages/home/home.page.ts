import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { Preferences } from '@capacitor/preferences';
import { MeteoService } from 'src/app/services/meteo.service';
import { LoadingController, ToastController } from '@ionic/angular';

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

  constructor(private meteoService: MeteoService, private toastController: ToastController,private loadingCtrl: LoadingController) { }

  async ngOnInit() {
    const loading = this.loadingCtrl.create({
      message:'Loading...',
      spinner:'dots'
    });
    (await loading).present();
    Geolocation.getCurrentPosition().then(async data => {
      this.coordinate = {
        latitude: data.coords.latitude,
        longitude: data.coords.longitude
      };
      await this.getPosition();
      (await loading).dismiss();
      this.getFavorites();
    });
  }

  async getPosition(): Promise<void> {
    const loading = this.loadingCtrl.create({
      message:'Loading...',
      spinner:'dots'
    });
    (await loading).present();
    this.meteoService.getWheaterLocation(this.coordinate.latitude, this.coordinate.longitude).subscribe(
       async data => {
        this.weatherData = data;
        (await loading).dismiss();
      },
      async error => {
        const toast = await this.toastController.create({
          message: error,
          duration: 3000,
          position: 'bottom'
        });
        await toast.present();
        (await loading).dismiss();
      }
    );
  }

  async getFavorites(): Promise<void> {
    const loading = await this.loadingCtrl.create({
      message: 'Loading favorites...',
      spinner: 'dots',
    });
      await loading.present();
    const favorite = await Preferences.get({ key: 'favorite' });
    console.log('Raw favorite data:', favorite);
    this.locations = favorite.value ? JSON.parse(favorite.value) : [];
    console.log('Parsed favorite locations:', this.locations);
    await loading.dismiss();
  }

}
