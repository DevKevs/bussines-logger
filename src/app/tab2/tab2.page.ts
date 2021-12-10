import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
interface Marker {
  position: {
    lat: number;
    lng: number;
  };
  title: string;
}
declare let google;
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{
  map = null;
  data: any;
  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    this.loadMap();
  }
  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngAfterContentInit(){
    this.getBussines();
  }
  async getBussines(){
    await this.http.get('https://bussines-api.herokuapp.com/api/bussines').subscribe(obj => {
      this.data = obj;
      console.log(this.data);
    });
  }
  loadMap() {
    // create a new map by passing HTMLElement
    const mapEle: HTMLElement = document.getElementById('map');
    // create LatLng object
    const myLatLng = {lat: 18.735693, lng: -70.162651};
    // create map
    this.map = new google.maps.Map(mapEle, {
      center: myLatLng,
      zoom: 8
    });

    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      mapEle.classList.add('show-map');
      this.renderMarkers();
    });
  }
  addMarker(marker: Marker) {
    return new google.maps.Marker({
      position: marker.position,
      map: this.map,
      title: marker.title
    });
  }
  reloadData(){
    this.getBussines();
    this.loadMap();
  }
  renderMarkers(){
    this.data.forEach(i => {
      const myMarker = {
        position:{
          lat: i.latitude,
          lng: i.longitude
        },
        title: i.address
      };
      this.addMarker(myMarker);
    });
  }
}
