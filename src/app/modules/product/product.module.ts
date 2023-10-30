import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductComponent } from './components/product/product.component';
import { NewProductComponent } from './components/new-product/new-product.component';
import { CategoryModule } from '../category/category.module';



@NgModule({
  declarations: [
    ProductComponent,
    NewProductComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    /* FlexLayoutModule, */ /* modulo obsoleto */
    FormsModule,
    ReactiveFormsModule,
    CategoryModule
  ]
})
export class ProductModule { }
