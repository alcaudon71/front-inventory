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

  /**
   * Invoca al webservice del Servidor que sirve para almacenar Producto
   * @param   body        Datos del producto a almacenar
   * @returns Observable  Observable con la info de la respuesta de la invocacion al webservice
   */
  saveProduct(body: any): Observable<Object> {
    const endpoint = `${base_url}/products`;   // endpoint del webservice del servidor que devuelve todos los productos

    console.log("Invocacion al webservice de saveProduct");

    return this.http.post(endpoint, body);

  }

  /**
   * Invoca al webservice del Servidor que sirve para actualizar Producto
   * @param body 
   * @param id 
   * @returns 
   */
  updateProduct(body: any, id: any): Observable<Object> {
    const endpoint = `${base_url}/products/${id}`;   // endpoint del webservice del servidor que devuelve todos los productos

    console.log("Invocacion al webservice de updateProduct");
    console.log("endpoint: " + endpoint);
    console.log("body: " + body);

    return this.http.put(endpoint, body);
  }

  /**
   * Eliminar Producto
   * @param id  Id del producto a eliminar
   * @returns Observable<Object>  Observable de la invocacion del servicio Eliminar Producto
   */
  deleteProduct (id: any): Observable<Object> {

    const endpoint = `${base_url}/products/${id}`;   // endpoint del webservice del servidor que elimina producto

    console.log("Invocacion al webservice de deleteProduct");
    console.log("endpoint: " + endpoint);
    console.log("id: " + id);

    return this.http.delete(endpoint);

  }

  /**
   * Buscar por nombre de Producto
   * @param name  Nombre del producto que debe ser buscado
   * @returns Observable<Object>  Observable de la invocacion del servicio
   */
  getProductByName (name: any): Observable<Object> {

    const endpoint = `${base_url}/products/filter/${name}`;   // endpoint del webservice del servidor que busca cadena

    console.log("Invocacion al webservice de filterByName");
    console.log("endpoint: " + endpoint);
    console.log("name: " + name);

    return this.http.get(endpoint);
    
  }


}
