import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { CategoryService } from 'src/app/modules/shared/services/category.service';
import { NewCategoryComponent } from '../new-category/new-category.component';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { ConfirmComponent } from 'src/app/modules/shared/components/confirm/confirm.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  // Inyectamos el Servicio de categorias y los elementos de Angular Material 
  private categoryService = inject(CategoryService);
  public  dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  

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

  /**
   * Apertura de un Dialog Modal cuando se pulsa el boton de Agregar Categoria
   */
  openCategoryDialog() {
    console.log("Category - openCategoryDialog ");

    // Se abre un Dialog que contiene en su interior el componente NewCategoryComponent
    const dialogRef = this.dialog.open(NewCategoryComponent, {
      width: '450px',   // ancho de la ventana del dialog
      data: {},
    });

    // Logica a ejecutar una vez se haya cerrado la ventana Dialog
    dialogRef.afterClosed().subscribe( (result: any) => {
      console.log('The dialog was closed');
      
      // Controlamos el retorno correcto o error
      if (result == 1) {
        this.openSnackBar("Categoria Agregada", "Exito");
        // Recargamos la tabla de categorias
        this.getCategories();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al guardar categoria", "Error");
      }

    });
  }

  /**
   * Modificar Categoria 
   * @param id
   * @param name
   * @param description 
   */
  onEdit (id1: number , name1: string, description1: string): void {
    console.log("Category - onEdit ");

    // Se abre un Dialog que contiene en su interior el componente NewCategoryComponent
    const dialogRef = this.dialog.open(NewCategoryComponent, {
      width: '450px',   // ancho de la ventana del dialog
      data: {id: id1, name: name1, description: description1},
    });

    // Logica a ejecutar una vez se haya cerrado la ventana Dialog
    dialogRef.afterClosed().subscribe( (result: any) => {
      console.log('The dialog was closed');
      
      // Controlamos el retorno correcto o error
      if (result == 1) {
        this.openSnackBar("Categoria actualizada", "Exito");
        // Recargamos la tabla de categorias
        this.getCategories();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al actualizar categoria", "Error");
      }

    });
  }

  /**
   * Eliminar Categoria 
   * @param id
   */
  onDelete (id1: number): void  {
    // Se abre un Dialog que contiene en su interior el componente ventana modal de Confirmacion
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: {id: id1},
    });

    // Logica a ejecutar una vez se haya cerrado la ventana Dialog
    dialogRef.afterClosed().subscribe( (result: any) => {
      console.log('The dialog was closed');
      
      // Controlamos el retorno correcto o error
      if (result == 1) {
        this.openSnackBar("Categoria eliminada", "Exito");
        // Recargamos la tabla de categorias
        this.getCategories();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al eliminar categoria", "Error");
      }

    });
  }

  /**
   * Abrir mensaje en una ventana
   */
  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {

    return this.snackBar.open(message, action, {duration: 2000});

  }

}

export interface CategoryElement {
  description: string;
  id: number;
  name: string;
}
