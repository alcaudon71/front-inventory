import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { CategoryElement } from 'src/app/modules/category/components/category/category.component';
import { ProductService } from 'src/app/modules/shared/services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  // Inyecciones de dependencias
  private productService = inject(ProductService);

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
        element.category = element.category.name;
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
