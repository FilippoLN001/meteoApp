import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { Preferences } from '@capacitor/preferences';
import { MeteoService } from 'src/app/services/meteo.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { TimeIcon } from '../../services/meteo.service'; // if you defined a separate model



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
  favoriteLocations: any[] = [];
  hours: TimeIcon[] = [];

  constructor(
    private meteoService: MeteoService,
    private toastController: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  async ngOnInit() {
    const loading = this.loadingCtrl.create({
      message: 'Loading...',
      spinner: 'dots',
    });
    (await loading).present();
    Geolocation.getCurrentPosition().then(async (data) => {
      this.coordinate = {
        latitude: data.coords.latitude,
        longitude: data.coords.longitude,
      };
      await this.getPosition();
      (await loading).dismiss();
      this.getFavorites();
    });
  }

  async getPosition(): Promise<void> {
    const loading = this.loadingCtrl.create({
      message: 'Loading...',
      spinner: 'dots',
    });
    (await loading).present();
    this.meteoService
      .getWheaterLocation(this.coordinate.latitude, this.coordinate.longitude)
      .subscribe(
        async (data) => {
          this.weatherData = data;
          (await loading).dismiss();
        },
        async (error) => {
          const toast = await this.toastController.create({
            message: error,
            duration: 3000,
            position: 'bottom',
          });
          await toast.present();
          (await loading).dismiss();
        }
      );
  }

  async getFavorites(): Promise<void> {
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const loading = await this.loadingCtrl.create({
      message: 'Loading favorites...',
      spinner: 'dots',
    });
    await loading.present();

    const favorite = await Preferences.get({ key: 'favorite' });
    console.log('Raw favorite data:', favorite.value);

    // Parse the favorite data and extract lat and lon
    const parsedFavorites = favorite.value ? JSON.parse(favorite.value) : [];
    this.locations = parsedFavorites.map((item: any) => ({
      lat: item.location.lat,
      lon: item.location.lon,
    }));

    console.log('Parsed favorite locations:', this.locations);
    if (
      this.locations.length > 0 &&
      this.locations.every((loc) => loc.lat && loc.lon)
    ) {
      for (const location of this.locations) {
        this.meteoService
          .getWheaterLocation(location.lat, location.lon)
          .subscribe(
            (data) => {
              console.log(
                `Weather data for ${location.lat}, ${location.lon}:`,
                data
              );
              this.favoriteLocations.push(data);
            },

            async (error) => {
              const toast = await this.toastController.create({
                message: `Error fetching weather data for ${location.lat}, ${location.lon}: ${error}`,
                duration: 3000,
                position: 'bottom',
              });
              await toast.present();
            }
          );
         this.meteoService.getHourLocationWheather(location.lat, location.lon, formattedDate)
           .subscribe(
             async (data) => {
               const currentHour = new Date(this.weatherData.location.localtime).getHours();

               this.hours = data.filter(hour => {
                const hourTime = new Date(hour.time).getHours();
                return hourTime > currentHour;
               })
             },
             async (error) => {
               const toast = await this.toastController.create({
                 message: `Error fetching hourly weather data for ${location.lat}, ${location.lon}: ${error}`,
                 duration: 3000,
                 position: 'bottom',
               });
               await toast.present();
             }
           );
      }
    } else {
      console.error('Locations array is empty or missing lat/lon properties');
    }

    await loading.dismiss();
  }

  async showHourWeather() {
    const favorite = await Preferences.get({ key: 'favorite' });
    console.log('Raw favorite data:', favorite.value);
  }
}
