import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from '../../services/category.service';
import { Observable } from 'rxjs';
import { ProductService } from '../../services/product.service';

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
  public productService = inject(ProductService);


  /**
   * Cancelar Accion
   */
  onNotClick(): void {
    // Cerramos ventana
    this.dialogRef.close();
  }

  /**
   * Confirmar Accion Eliminar
   * --> Permite eliminar cualquier tipo de objeto de la aplicacion
   * --> Category, Product
   */
  onDelete() {
    console.log("onDelete - data: ", this.data);

    // Si en el Dialog hemos recibido algun id de categoria
    if (this.data != null) {

      // Tratamiento para borrado de objeto Category
      if (this.data.module == "category") {

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

      } else if (this.data.module == "product") {
          // Tratamiento para borrado de objeto Product

          let obsProductDelete: Observable<Object> = this.productService.deleteProduct(this.data.id);

          obsProductDelete.subscribe({
            next: (item:any) => {
              this.dialogRef.close(1);   // retorno correcto "1"
            }
            ,
            error: (error:any) => {
              this.dialogRef.close(2);   // retorno error "2"
            }
  
          });

      }

    } else {
      // No hemos recibido id en el Dialog 
      // cerramos y devolvemos retorno "2"
      this.dialogRef.close(2);
    }
  }


}
