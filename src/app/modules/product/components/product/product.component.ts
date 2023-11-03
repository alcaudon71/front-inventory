import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { CategoryElement } from 'src/app/modules/category/components/category/category.component';
import { NewCategoryComponent } from 'src/app/modules/category/components/new-category/new-category.component';
import { ProductService } from 'src/app/modules/shared/services/product.service';
import { NewProductComponent } from '../new-product/new-product.component';
import { ConfirmComponent } from 'src/app/modules/shared/components/confirm/confirm.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  // Inyecciones de dependencias
  private productService = inject(ProductService);
  public  dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  // Columnas que van a ser mostradas en la tabla de la consulta 
  displayedColumns: string[] = ['id', 'name', 'price', 'account', 'category', 'picture', 'actions'];
  // Datasource para transferir datos
  dataSource = new MatTableDataSource<ProductElement>();
 
  // Atributo del paginador
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor() {}

  ngOnInit(): void {
    this.getProducts();
  }

  /**
   * Obtencion de todos los productos de la aplicacion
   */
  getProducts(): void {
    let obsProducts : Observable<Object> = this.productService.getProducts();

    // Nos suscribimos al observable de productos para recibir sus items 
    obsProducts.subscribe({
      next: (data:any) => {
        console.log("respuesta de productos: ", data);
        // Procesamos el item de repuesta
        this.processProductResponse(data);
      },
      error: (error:any) => {
        console.log("error en productos: ", error);
      }
    })
  }

  processProductResponse (resp:any) {
    const dateProduct: ProductElement[] = [];

    if (resp.metadata[0].code == "00") {
      let listCProduct = resp.productResponse.products;

      // Vamos recuperando los datos de la lista
      // Transformamos los campos categoria e imagen 
      listCProduct.forEach( (element: ProductElement) => {
        //element.category = element.category.name;
        // La imagen viene en formato base64 del webservice del servidor 
        // Le tenemos que añadir el siguiente prefijo para que sea legible por Angular
        element.picture = 'data:image/jpeg;base64,' + element.picture;
        dateProduct.push(element);
        
      });

      // Establecemos el datasource
      this.dataSource = new MatTableDataSource<ProductElement>(dateProduct);
      this.dataSource.paginator = this.paginator;

    }

  }

  /**
   * Apetura de Dialog para mostra el componente de Nuevo Producto
   */
  openProductDialog(): void {
    console.log("Product - openProductDialog ");

    // Se abre un Dialog que contiene en su interior el componente NewProductComponent
    const dialogRef = this.dialog.open(NewProductComponent, {
      width: '450px',   // ancho de la ventana del dialog
      data: {},
    });

    // Logica a ejecutar una vez se haya cerrado la ventana Dialog
    dialogRef.afterClosed().subscribe( (result: any) => {
      console.log('The dialog was closed');
      
      // Controlamos el retorno correcto o error
      if (result == 1) {
        this.openSnackBar("Producto Agregado", "Exito");
        // Recargamos la tabla de productos
        this.getProducts();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al guardar producto", "Error");
      }

    });
  }
  
  /**
   * Abrir mensaje en una ventana
   * --- Esto podria estar en el modulo shared --- 
   */
  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {

      return this.snackBar.open(message, action, {duration: 2000});
  
  }
  
  /**
   * Modificar Producto
   * @param id1         Id del producto
   * @param name1       Nuevo nombre del producto
   * @param price1      Nuevo precio del produto
   * @param account1    Nueva cantidad del producto
   * @param category1   Nueva categoria del producto 
   */
  edit(id1: number, name1: string, price1:number, account1:number, category1:any): void {

    console.log("Product - edit ");

    // Se abre un Dialog que contiene en su interior el componente NewProductComponent
    const dialogRef = this.dialog.open(NewProductComponent, {
      width: '450px',   // ancho de la ventana del dialog
      data: {id: id1, name: name1, price: price1, account: account1, category: category1},
    });

    // Logica a ejecutar una vez se haya cerrado la ventana Dialog
    dialogRef.afterClosed().subscribe( (result: any) => {
      console.log('The dialog was closed');
      
      // Controlamos el retorno correcto o error
      if (result == 1) {
        this.openSnackBar("Producto Modificado", "Exito");
        // Recargamos la tabla de productos
        this.getProducts();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al modificar producto", "Error");
      }

    });

  }

  /**
   * Eliminar producto
   * @param id1   Id del producto a eliminar
   */
  delete (id1: any): void {

    console.log("Product - delete ");

    // Se abre un Dialog que contiene en su interior el componente ConfirmComponent
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '450px',   // ancho de la ventana del dialog
      data: {id: id1, module: "product"}, // se indica el tipo de objeto a eliminar (product)
    });

    // Logica a ejecutar una vez se haya cerrado la ventana Dialog
    dialogRef.afterClosed().subscribe( (result: any) => {
      console.log('The dialog was closed');
      
      // Controlamos el retorno correcto o error
      if (result == 1) {
        this.openSnackBar("Producto Eliminado", "Exito");
        // Recargamos la tabla de productos
        this.getProducts();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al eliminar producto", "Error");
      }

    });

  }

}

// Interface con el objeto Producto
export interface ProductElement {
  id: number;
  name: string;
  price: number;
  account: number;
  category: any;  
  picture: any;
}
