import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { LogoComponent } from './components/logo/logo.component';
import { AddUpdateProductComponent } from './components/add-update-product/add-update-product.component';
import { CustomInputComponent } from './components/custom-input/custom-input.component';
import { BillComponent } from './components/bill/bill.component';
import { ShoppingHistoryComponent } from './components/shopping-history/shopping-history.component';


@NgModule({
  declarations: [
    HeaderComponent,
    LogoComponent,
    AddUpdateProductComponent,
    CustomInputComponent,
    BillComponent,
    ShoppingHistoryComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  exports: [
    HeaderComponent,
    LogoComponent,
    AddUpdateProductComponent,
    CustomInputComponent,
    BillComponent,
    ShoppingHistoryComponent,
  ]
})
export class SharedModule { }
