import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  @Input() bss: any;
  name: any;
  type: any;
  address: any;
  result: any;
  public base64Image: string;
  // eslint-disable-next-line max-len
  constructor(public modalController: ModalController, public alertController: AlertController, private camera: Camera, private http: HttpClient) { }

  ngOnInit() {
    this.name = this.bss.name;
    this.type = this.bss.type;
    this.address = this.bss.address;
    this.base64Image = this.bss.photo;
    console.log(this.bss);
  }
  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true
    });
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
  updateBussines(){
    // eslint-disable-next-line max-len
    if (this.name != null && this.type != null && this.address != null) {
      const requestBody = {
        name: this.name,
        typeOfBussiness: this.type,
        photo: this.base64Image,
        latitude: this.bss.latitude,
        longitude: this.bss.longitude,
        address: this.address
      };
      // eslint-disable-next-line no-underscore-dangle
      this.http.put('https://bussines-api.herokuapp.com/api/bussines/edit/' + this.bss._id, requestBody).subscribe(obj => {
        this.result = obj;
        if(this.result != null){
         alert('Negocio actualizado');
          this.dismiss();
        }
      });
    }
    else{
      alert('Llene todos los campos');
    }
  }
}
