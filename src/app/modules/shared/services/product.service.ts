import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

const base_url = "http://localhost:8080/api/v1";   // ruta de los servicios rest de la app servidor

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // Inyecciones
  private http = inject(HttpClient);

  //constructor(private http: HttpClient) { }

  /**
   * Obtencion de todos los productos de la aplicacion
   * @return  Observable  Devuelve un observable con el item con todos los productos de la aplicacion
   */
  getProducts(): Observable<Object> {
    const endpoint = `${base_url}/products`;   // endpoint del webservice del servidor que devuelve todos los productos

    let obsProducts: Observable<Object> = this.http.get(endpoint);

    return obsProducts;

  }


}
