import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

//const base_url = "http://localhost:8080/api/v1/categories";
const base_url = "http://localhost:8080/api/v1";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  // Inyeccion para permitir conexion con servicios HTTP
  constructor(private http: HttpClient) { }

  /**
   *  Obtencion de listado de categorias
   *  @returns Observable con el listado de categorias
   */
  getCategories(): Observable<Object> {

    const endpoint = `${base_url}/categories`;

    let retorno: Observable<Object> = this.http.get(endpoint);

    return retorno;

  }

  /**
   * Almacenar categoria
   * @param body JSON con nombre y descripcion de la categoria
   * @returns Observable
   */
  saveCategory(body: any): Observable<Object> {
    const endpoint = `${base_url}/categories`;

    let retorno: Observable<Object> = this.http.post(endpoint, body);

    return retorno;

  }

  /**
   * Modificar categoria
   * endpoint --> http://localhost:8080/api/v1/categories/4
   * @param body JSON con nombre y descripcion de la categoria
   * @param id   Id de la categoria que debe ser modificada
   * @returns Observable
   */
  updateCategory(body: any, id: any): Observable<Object> {
    const endpoint = `${base_url}/categories/${id}`;  

    let retorno: Observable<Object> = this.http.put(endpoint, body);   // put --> actualizar registro

    return retorno;

  }

}
