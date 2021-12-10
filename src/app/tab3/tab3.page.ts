import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import city from 'src/assets/json/locations.json';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  ciudades: any = city;
  lat: any;
  lgn: any;
  name: any;
  type: any;
  address: any;
  target: any;
  public auxImage = 'https://i.pinimg.com/originals/d1/de/67/d1de67012e6fcf5c449051ed5758dcc9.jpg';
  public base64Image: string;
  result: any;
  constructor(public alertController: AlertController, private camera: Camera, private http: HttpClient) {}
  ngOnInit(): void {
  }
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Selecciona!',
      message: 'Eliga subir una foto <ion-icon name="image"></ion-icon> o capturar una foto <ion-icon name="camera"></ion-icon>',
      buttons: [
        {
          text: 'Subir',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Subiendo foto...');
            this.loadPicture();
          }
        }, {
          text: 'Capturar',
          handler: () => {
            console.log('Capturando foto...');
            this.takePicture();
          }
        }, {
          text: 'Cerrar',
          role: 'cancel',
          handler: () => {
            console.log('Cancelando...');
          }
        }
      ]
    });

    await alert.present();
  }
  piker(i: any){
    this.lat = i.Lat;
    this.lgn = i.Long;
  }
  takePicture(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
    });
  }
  loadPicture(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: false,
      targetHeight: 1024,
      targetWidth: 1024,
      correctOrientation: true,
      saveToPhotoAlbum: true
    };
    this.camera.getPicture(options).then(imageData => {
     this.base64Image = `data:image/jpeg;base64,${imageData}`;
    }, (err) => {
     console.log(err);
    });
  }
  addBussines(){
    // eslint-disable-next-line max-len
    if (this.name != null && this.type != null  && this.lat != null && this.lgn != null && this.address != null) {
      if (this.base64Image ==  null) {
        this.base64Image = this.auxImage;
      }
      const requestBody = {
        name: this.name,
        typeOfBussiness: this.type,
        photo: this.base64Image,
        latitude: this.lat,
        longitude: this.lgn,
        address: this.address
      };
      this.http.post('https://bussines-api.herokuapp.com/api/bussines/add', requestBody).subscribe(obj => {
        this.result = obj;
        if(this.result != null){
         alert('Negocio agregado');
         this.name = '';
         this.type = '';
         this.base64Image = '';
         this.address = '';
         this.lat = '';
         this.lgn = '';
        }
      });
    }
    else{
      alert('Llene todos los campos');
    }
  }
}
