import { Component, OnInit, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Chart } from 'chart.js';
import { Observable } from 'rxjs';
import { ProductElement } from 'src/app/modules/product/components/product/product.component';
import { ProductService } from 'src/app/modules/shared/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  // Inyecciones de dependencias
  private productService = inject(ProductService);
  //public  dialog = inject(MatDialog);
  //private snackBar = inject(MatSnackBar);
  //private util = inject(UtilService);

  // Graficos de Barras y Donut de la aplicacion
  // Mostrara las estadisticas de productos
  chartBar: any;
  chartDoughnut: any;


  ngOnInit(): void {
    // Cargamos el barchart con los datos de productos
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
  
    // Arrays con la lista de productos y la lista de cantidades asociada
    const nameProduct: string[] = [];
    const account: number[] = [];

    if (resp.metadata[0].code == "00") {
        let listCProduct = resp.productResponse.products;
  
        // Vamos recuperando los datos de la lista
        // Almacenaremos nombre del producto y cantidad en stock
        listCProduct.forEach( (element: ProductElement) => { 
          //element.category = element.category.name;
          // Guardamos nombre y cantidad en los arrays correspondientes
          nameProduct.push(element.name);
          account.push(element.account);
          
        });
        
        // Configuracion del grafico de tipo barchart
        const name: any = 'canvas-bar';
        const config: any = {
          type: 'bar',
          data: {
            labels: nameProduct,   // nombres de los productos
            datasets: [
              {label: 'Productos', data: account}   // cantidades de los productos
            ]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          },
        };

        // Generamos el grafico de barras con la configuracion anterior
        this.chartBar = new Chart(name, config);
 
        // Configuracion del grafico de tipo doughnut
        const name2: any = 'canvas-doughnut';
        const config2: any = {
          type: 'doughnut',
          data: {
            labels: nameProduct,   // nombres de los productos
            datasets: [
              {label: 'Productos', data: account}   // cantidades de los productos
            ]
          }
        };

        // Generamos el grafico de doughnut con la configuracion anterior
        this.chartDoughnut = new Chart(name2, config2);

    }
  
  }

}
