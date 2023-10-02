import { Component, OnInit, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { CategoryService } from 'src/app/modules/shared/services/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  // Inyectamos el Servicio de categorias
  private categoryService = inject(CategoryService);

  // Columnas que van a ser mostradas en la tabla de la consulta 
  displayedColumns: string[] = ['id', 'name', 'description', 'actions'];
  // Datasource para transferir datos
  dataSource = new MatTableDataSource<CategoryElement>();

  ngOnInit(): void {
    console.log("CategoryComponent - ngOnInit");
    this.getCategories();
  }

  // obtencion de categorias
  getCategories(): void {

    let obsCategories: Observable<Object> = this.categoryService.getCategories();

    // Suscripcion al observable del servicio categorias
    // Vamos recibiendo items en formato json
    // Establecemos el metodo que va a realizar el tratamiento del item recibido y del posible error
    obsCategories.subscribe({ 
      next: (data: any) => {
        console.log("respuesta categories: ", data);
        this.processCategoriesResponse(data);
      },
      error: (error: any) => {
        console.log("error: ", error);
      }
    });

  }

  // Cargar el datasource con la info recibida en el item del observable
  processCategoriesResponse (resp: any) {
    const dataCategory: CategoryElement[] = [];

    // Si el codigo devuelto por el servicio del backend es correcto ("00")
    if (resp.metadata[0].code == "00") {
      let listCategory = resp.categoryResponse.category;

      // Cargamos en la lista todos los elementos que hayan venido en el json del observable
      listCategory.forEach( (element: CategoryElement) => {
        dataCategory.push(element);
      } );

      // Cargamos el listado de elementos en el datasource que se mostrará en el html
      this.dataSource = new MatTableDataSource<CategoryElement>(dataCategory);

    }

  }

}

export interface CategoryElement {
  description: string;
  id: number;
  name: string;
}
