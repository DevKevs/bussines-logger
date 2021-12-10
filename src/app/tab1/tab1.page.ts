import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{
  data: any;
  result: any;
  constructor(public alertController: AlertController, private http: HttpClient, public modalController: ModalController) {}
  ngOnInit(): void {
    this.getBussines();
  }
  async presentAlertConfirm(id: any) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Eliminar negocio',
      message: '¿Esta seguro de eliminar este negocio?',
      buttons: [
       {
          text: 'SI',
          handler: () => {
            console.log('Borrando...');
            this.deleteBussies(id);
          }
        }, {
          text: 'NO',
          role: 'cancel',
          handler: () => {
            console.log('Cancelando...');
          }
        }
      ]
    });

    await alert.present();
  }

  getBussines(){
    this.http.get('https://bussines-api.herokuapp.com/api/bussines').subscribe(obj => {
      this.data = obj;
      console.log(this.data);
    });
  }
  reloadBussines(event){
    this.http.get('https://bussines-api.herokuapp.com/api/bussines').subscribe(obj => {
      this.data = obj;
      console.log(this.data);
    });
    event.target.complete();
  }
  deleteBussies(id: any){
    this.http.delete('https://bussines-api.herokuapp.com/api/bussines/delete/'+id).subscribe(obj => {
      this.result = obj;
      this.getBussines();
      alert('Negocio eliminado');
    });
  }
  async modal(obj: any){
    const modal = await this.modalController.create({
      component: ModalPage,
      cssClass: 'my-custom-class',
      componentProps: {
        bss: obj,
      }
    });
    return await modal.present();
  }
}
