import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { CategoryComponent } from 'src/app/modules/category/components/category/category.component';
import { CategoryService } from 'src/app/modules/shared/services/category.service';
import { ProductService } from 'src/app/modules/shared/services/product.service';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class NewProductComponent implements OnInit{

  // Atributo para indicar si el Dialog va a ser Crear Producto o Actualizar Producto
  estadoFormulario: string = "";

  categories: CategoryElement[] = [];

  selectedFile: any;
  nameImg: string = "";

  // Objeto para trabajar con el Formulario de la ventana
  // ---> se utiliza en el form del html 
  public productForm!: FormGroup;

  // Inyeccion de dependencias
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private productService = inject(ProductService);
  //private dialogRef = inject(MatDialogRef<NewProductComponent>);
  private dialogRef = inject(MatDialogRef);
  public data = inject(MAT_DIALOG_DATA);   // token que permite acceder a los datos del Dialog
  
  ngOnInit(): void {
    
    console.log("NewProductComponent - ngOnInit");
    console.log("data: ", this.data);
    console.log("name: ", this.data.name);

    // Construccion del formulario con la estructura indicada
    // Inicialmente, al crear mostramos el formulario con los campos vacios 
    this.productForm = this.fb.group({
      name:       ['', Validators.required],   // valor por defecto y validacion requerida
      price:      ['', Validators.required],
      account:    ['', Validators.required],
      category:   ['', Validators.required],
      picture:    ['', Validators.required]
    });

    // Obtenemos todas las  categorias disponibles para el combo de Categorias del formulario de Nuevo Producto
    this.getCategories();

    this.estadoFormulario = "Agregar";

    // Si el Dialog viene con datos, es que hemos entrado en la ventana Modificar y no en la ventana Crear
    // Los datos que vienen corresponden a la info actual que tiene el registro
    // Por tanto, la ventana Dialog se abrira mostrando en el formulario los datos actuales
    if (this.data.name != null) {
      console.log(" *** Funcionalidad Modificar *** ");
      //this.updateForm (this.data);
      this.estadoFormulario = "Actualizar";
    } else {
      console.log(" *** Funcionalidad Agregar *** ");
    }

  }

  /**
   * Confirmar creacion de nuevo Producto 
   * Se invoca desde el boton Guardar de la ventana Dialog de nuevo producto
   */
  onSave(): void {
      console.log("NewProduct - onSave -data: ", this.data );
  
      let dataJson = {
        name: this.productForm.get('name')?.value,   // esto obtiene "value" si el campo no es null
        price: this.productForm.get('price')?.value,
        account: this.productForm.get('account')?.value,
        category: this.productForm.get('category')?.value,
        picture: this.selectedFile 
      }
  
      // Formulario de datos que hay que enviar al servicio
      const uploadImageData = new FormData();

      // El formulario se debe crear con los nombres especificados en el webservice del Servidor
      // --> picture, name, price, account y categoryId
      uploadImageData.append('picture', dataJson.picture, dataJson.picture.name);
      uploadImageData.append('name', dataJson.name);
      uploadImageData.append('price', dataJson.price);
      uploadImageData.append('account', dataJson.account);
      uploadImageData.append('categoryId', dataJson.category);


      // Si el Dialog no tenia datos de partida --> funcion crear
      // Si el Dialog ya tenia datos al principio --> funcion modificar
      if (this.data.id != null) {
        // Funcionalidad Actualizar producto
  
        // ????????????????????????????????????????????????????????????????????????????????????????????????????????
        //let obsProductUpdate: Observable<Object> = this.productService.updateProduct(dataJson, this.data.id);
        let obsProductUpdate: Observable<Object> = this.productService.saveProduct(dataJson);
  
        obsProductUpdate.subscribe({
          next: (item: any) => {
            console.log("Modificar producto actual: " + item);
  
            // Ejecucion correcta: Cerramos y devolvemos el control al componente invocador, le devolvemos un codigo "1"
            this.dialogRef.close(1);
          },
          error: (error:any) => {
            // Ejecucion correcta: Cerramos y devolvemos el control al componente invocador, le devolvemos un codigo "2"
            this.dialogRef.close(2);
          }
        })
  
      } else {
        // Funcionalidad Crear producto
  
        //let obsProductSave: Observable<Object> = this.productService.saveProduct(dataJson);
        let obsProductSave: Observable<Object> = this.productService.saveProduct(uploadImageData);
  
        // Nos suscribimos a la accion saveProduct del servicio para obtener los items producidos
        obsProductSave.subscribe({
          next: (item: any) => {
            console.log("crear nuevo producto: " + item);
  
            // Ejecucion correcta: Cerramos y devolvemos el control al componente invocador, le devolvemos un codigo "1"
            this.dialogRef.close(1);
          },
          error: (error: any) => {
            // Ejecucion con error: Cerramos y devolvemos el control al componente invocador, le devolvemos un codigo "2"
            this.dialogRef.close(2);
          }
        });
  
      }
  
  }

  /**
   * Cancelar creacion de nueva categoria
   */
  onCancel(): void {
      console.log("cancelar creacion de nueva categoria");
      this.dialogRef.close(3);
  }


  /**
   * Obtencion de todas las  categorias disponibles para el combo de Categorias del formulario de Nuevo Producto
   * --> Cargamos la lista en el atributo this.categories
   */
  getCategories() : void {

    this.categoryService.getCategories().subscribe({
      next: (data:any) => {
        // Cargamos los objetos de tipo CategoryElement
        this.categories = data.categoryResponse.category;
      },
      error: (error:any) => {
        console.log("Error al obtener la lista de categorias");
      }

    })
  }

  /**
   * Tratamiento de la imagen subida por el usuario
   * @param event   Evento con la imagen 
   */
  onFileChanged(event: any): void {
    // Extraemos el fichero del evento
    this.selectedFile = event.target.files[0];

    console.log(this.selectedFile);

    // Extraemos el nombre del fichero
    this.nameImg = event.target.files[0].name;
  }

}

// Interface con el objeto Producto
export interface CategoryElement {
  id: number;
  name: string;
  description: string;
}
