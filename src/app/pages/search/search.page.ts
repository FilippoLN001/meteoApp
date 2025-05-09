import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { ToastController, LoadingController } from '@ionic/angular';
import { MeteoService } from 'src/app/services/meteo.service';

@Component({
  selector: 'app-search',
  standalone: false,
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  location = {
    position: '',
  }
  weatherData: any;
  favoriteWeather: any[] = [];

  constructor(private meteoService: MeteoService, private toastController: ToastController, private loadingCtrl: LoadingController) { }

  ngOnInit() {
  }

  async submitForm() {
    if (this.isFormComplete()) {
      await this.getLocation();
    }
  }

  isFormComplete(): boolean {
    return !!(this.location.position);
  }

  async getLocation(): Promise<void> {
  const loading = await this.loadingCtrl.create({
      message: 'Loading favorites...',
      spinner: 'dots',
     });
     await loading.present();
    (await this.meteoService.getLocationPosition(this.location.position)).subscribe(async data => {
      this.weatherData = data;
      await loading.dismiss();
    },
    async error => {
      const toast = await this.toastController.create({
        message: error,
        duration: 3000,
        position: 'bottom'
      });
      await toast.present();
      await loading.dismiss();
    });
  }

  async addFavorite() {
    if (this.weatherData) {
      // Retrieve existing favorites
      const existingFavorites = await Preferences.get({ key: 'location' });
      let favorites = [];

      // Check if existingFavorites.value is a valid JSON string
      if (existingFavorites.value) {
        try {
          favorites = JSON.parse(existingFavorites.value);
          // Ensure favorites is an array
          if (!Array.isArray(favorites)) {
            favorites = [];
          }
        } catch (error) {
          console.error('Error parsing favorites:', error);
          favorites = [];
        }
      }

      // Add new favorite to the list
      favorites.push(this.weatherData);

      // Save updated list back to Preferences
      await Preferences.set({
        key: 'location',
        value: JSON.stringify(favorites)
      });
      console.log('Favorite location saved successfully');
    } else {
      console.log('No weather data available to save');
    }
  }

}
