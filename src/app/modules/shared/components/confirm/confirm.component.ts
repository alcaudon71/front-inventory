import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from '../../services/category.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent {

  // Inyecciones
  public dialogRef = inject(MatDialogRef);
  public data = inject(MAT_DIALOG_DATA);   // token que permite acceder a los datos del Dialog 
  public categoryService = inject(CategoryService);


  /**
   * Cancelar Accion
   */
  onNotClick(): void {
    // Cerramos ventana
    this.dialogRef.close();
  }

  /**
   * Confirmar Accion
   */
  onDelete() {
    console.log("onDelete - data: ", this.data);

    // Si en el Dialog hemos recibido algun id de categoria
    if (this.data != null) {
      let obsCategoryDelete: Observable<Object> = this.categoryService.deleteCategory(this.data.id);

      obsCategoryDelete.subscribe({
        next: (item:any) => {
          this.dialogRef.close(1);   // retorno correcto "1"
        }
        ,
        error: (error:any) => {
          this.dialogRef.close(2);   // retorno error "2"
        }

      });

    } else {
      // No hemos recibido id en el Dialog 
      // cerramos y devolvemos retorno "2"
      this.dialogRef.close(2);
    }
  }


}
