import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  mobileQuery: MediaQueryList;  // obtener Medios disponibles para el dispositivo

  menuNav = [
    {name: "Home", route: "home", icon: "home"},
    {name: "Categorias", route: "category", icon: "category"},
    {name: "Productos", route: "products", icon: "production_quantity_limits"}
  ];

  constructor(media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)'); // Establece un maximo de 600px para considerar el Medio como android
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    console.log("Method not implemented");
  }

}
