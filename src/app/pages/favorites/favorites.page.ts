import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-favorites',
  standalone: false,
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit {
  weatherData: any[] = [];

  constructor() { }

  async ngOnInit() {
    const favorite = await Preferences.get({ key: 'location' });
    console.log('Raw favorite data:', favorite);
    this.weatherData = favorite.value ? [JSON.parse(favorite.value)] : [];
    console.log('Parsed favorite locations:', this.weatherData);
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
}
