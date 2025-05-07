import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { ToastController } from '@ionic/angular';
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
  favoriteWeather : any[] = [];


  constructor(private meteoService: MeteoService, private toastController: ToastController) { }

  ngOnInit() {
  }

  async submitForm(){
    if(this.isFormComplete()){
        await this.getLocation();
    }
  }

  isFormComplete() : boolean {
    return !! (this.location.position);
  }

   async getLocation(): Promise<void>{
     (await this.meteoService.getLocationPosition(this.location.position)).subscribe(data => {
       this.weatherData = data;
       },
       async error =>{
        const toast = await this.toastController.create({
          message: error,
          duration: 3000,
          position: 'bottom'
        });
        await toast.present();
       }
      );
     }

     async addFavorite() {
      if (this.weatherData) {
        await Preferences.set({
          key: 'location',
          value: JSON.stringify(this.weatherData) // Ensure the data is stored as a string
        });
        console.log('Favorite location saved successfully');
      } else {
        console.log('No weather data available to save');
      }
    }
}
