import { createInjectableType } from '@angular/compiler';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { CategoryService } from 'src/app/modules/shared/services/category.service';

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.css']
})
export class NewCategoryComponent implements OnInit {

  // Objeto para trabajar con el Formulario de la ventana
  // ---> se utiliza en el form del html 
  public categoryForm!: FormGroup;

  // Inyeccion de dependencias
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private dialogRef = inject(MatDialogRef<NewCategoryComponent>);

  /**
   * 
   */
  ngOnInit(): void {
    console.log("NewCategoryComponent - ngOnInit");

    // Construccion del formulario con la estructura indicada
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],   // valor por defecto y validacion requerida
      description: ['', Validators.required]
    });

  }

  /**
   * Confirmar creacion de nueva Categoria 
   * Se invoca desde el boton Guardar de la ventana Dialog de nueva categoria
   */
  onSave() {
    let dataJson = {
      name: this.categoryForm.get('name')?.value,   // esto obtiene "value" si el campo no es null
      description: this.categoryForm.get('description')?.value 
    }

    let obsService: Observable<Object> = this.categoryService.saveCategory(dataJson);

    // Nos suscribimos a la accion saveCategory del servicio para obtener los items producidos
    obsService.subscribe({
      next: (data: any) => {
        console.log("crear nueva categoria: " + data);

        // Ejecucion correcta: Cerramos y devolvemos el control al componente invocador, le devolvemos un codigo "1"
        this.dialogRef.close(1);
      },
      error: (error: any) => {
        // Ejecucion con error: Cerramos y devolvemos el control al componente invocador, le devolvemos un codigo "2"
        this.dialogRef.close(2);
      }
    });

  }

  /**
   * Cancelar creacion de nueva categoria
   */
  onCancel() {
    console.log("cancelar creacion de nueva categoria");
    this.dialogRef.close(3);
  }

}
