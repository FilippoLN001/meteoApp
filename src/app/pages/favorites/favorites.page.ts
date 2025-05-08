import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-favorites',
  standalone: false,
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit {
  weatherData: any[] = [];

  constructor(private loadingCtrl: LoadingController) { }

  async ngOnInit() {
    await this.loadWeather();
  }

  ionViewWillEnter() { //ion lifecycle
    this.loadWeather();
  }

  async addToHome() {
    if (this.weatherData.length > 0) {
      await Preferences.set({
        key: 'favorite',
        value: JSON.stringify(this.weatherData)
      });
      console.log('Favorite location saved successfully');
    } else {
      console.log('No weather data available to save');
    }
  }

  async loadWeather(){

const loading = await this.loadingCtrl.create({
      message: 'Loading favorites...',
      spinner: 'dots',
    });
    await loading.present();
    const favorite = await Preferences.get({ key: 'location' });
    console.log('Raw favorite data:', favorite);
    this.weatherData = favorite.value ? JSON.parse(favorite.value) : [];
    console.log('Parsed favorite locations:', this.weatherData);
    await loading.dismiss();
  }
}
