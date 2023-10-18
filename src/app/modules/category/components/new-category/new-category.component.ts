import { createInjectableType } from '@angular/compiler';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { CategoryService } from 'src/app/modules/shared/services/category.service';

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.css']
})
export class NewCategoryComponent implements OnInit {

  // Atributo para indicar si el Dialog va a ser Crear Categoria o Actualizar Categoria
  estadoFormulario: string = "";

  // Objeto para trabajar con el Formulario de la ventana
  // ---> se utiliza en el form del html 
  public categoryForm!: FormGroup;

  // Inyeccion de dependencias
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  //private dialogRef = inject(MatDialogRef<NewCategoryComponent>);
  private dialogRef = inject(MatDialogRef);
  public data = inject(MAT_DIALOG_DATA);   // token que permite acceder a los datos del Dialog 

  /**
   * ngOnInit 
   */
  ngOnInit(): void {
    console.log("NewCategoryComponent - ngOnInit");
    console.log("data: ", this.data);
    console.log("name: ", this.data.name);

    // Construccion del formulario con la estructura indicada
    // Inicialmente, al crear mostramos el formulario con los campos vacios 
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],   // valor por defecto y validacion requerida
      description: ['', Validators.required]
    });

    this.estadoFormulario = "Agregar";

    // Si el Dialog viene con datos, es que hemos entrado en la ventana Modificar y no en la ventana Crear
    // Los datos que vienen corresponden a la info actual que tiene la categoria
    // Por tanto, la ventana Dialog se abrira mostrando en el formulario los datos actuales
    if (this.data.name != null) {
      console.log(" *** Funcionalidad Modificar *** ");
      this.updateForm (this.data);
      this.estadoFormulario = "Actualizar";
    } else {
      console.log(" *** Funcionalidad Agregar *** ");
    }


  }

  /**
   * Confirmar creacion de nueva Categoria 
   * Se invoca desde el boton Guardar de la ventana Dialog de nueva categoria
   */
  onSave(): void {
    console.log("NewCategory - onSave -data: ", this.data );

    let dataJson = {
      name: this.categoryForm.get('name')?.value,   // esto obtiene "value" si el campo no es null
      description: this.categoryForm.get('description')?.value 
    }

    // Si el Dialog no tenia datos de partida --> funcion crear
    // Si el Dialog ya tenia datos al principio --> funcion modificar
    if (this.data.id != null) {
      // Funcionalidad Actualizar categoria

      let obsCategoryUpdate: Observable<Object> = this.categoryService.updateCategory(dataJson, this.data.id);

      obsCategoryUpdate.subscribe({
        next: (item: any) => {
          console.log("Modificar categoria actual: " + item);

          // Ejecucion correcta: Cerramos y devolvemos el control al componente invocador, le devolvemos un codigo "1"
          this.dialogRef.close(1);
        },
        error: (error:any) => {
          // Ejecucion correcta: Cerramos y devolvemos el control al componente invocador, le devolvemos un codigo "2"
          this.dialogRef.close(2);
        }
      })

    } else {
      // Funcionalidad Crear categoria

      let obsCategorySave: Observable<Object> = this.categoryService.saveCategory(dataJson);

      // Nos suscribimos a la accion saveCategory del servicio para obtener los items producidos
      obsCategorySave.subscribe({
        next: (item: any) => {
          console.log("crear nueva categoria: " + item);

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
   * Actualizar formulario con los datos actuales de la categoria
   * @param data 
   */
  updateForm (data:any) {
    console.log("NewCategory - updateForm");

    // Construccion del formulario con los datos recibidos
    // Asi, cuando se abra el formulario, se mostraran los datos actuales del registro
    this.categoryForm = this.fb.group({
      name: [data.name, Validators.required],   // valor por defecto y validacion requerida
      description: [data.description, Validators.required]
    });

  }

}
