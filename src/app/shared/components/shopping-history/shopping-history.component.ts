import { Component, OnInit } from '@angular/core';
import { User } from 'firebase/auth';
import { Bill } from 'src/app/model/bill.model';
import { CartProduct } from 'src/app/model/cartProduct.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-shopping-history',
  templateUrl: './shopping-history.component.html',
  styleUrls: ['./shopping-history.component.scss'],
})
export class ShoppingHistoryComponent  implements OnInit {
  
  user = {} as User;
  bills: Bill[] = [];
  loading: boolean = false;

  constructor(
    private firebaseSvc: FirebaseService,
    private utilSvc: UtilService,
  ) {}

  ngOnInit() {
    this.getUser();
    this.getShoppingHistory();
  }

  getUser() {
    return (this.user = this.utilSvc.getElementFromLocalStorage('user'));
  }

  getShoppingHistory() {
    this.loading = true;
    let sub = this.firebaseSvc.getCollectionWhere('bills', 'userEmail', this.user.email).subscribe({
      next: (res: Bill[]) => {
        this.bills = res;
        sub.unsubscribe();
        this.loading = false;
      },
    });
  }

  calculateTotalPriceWithDiscount(product: CartProduct): number {
    if (product.discount > 0) {
      // Calcula el precio con descuento aplicando el porcentaje de descuento
      const discountedPrice = product.price - product.price * (product.discount / 100);
  
      // Calcula el precio total con descuento tomando en cuenta la cantidad de productos en el carrito
      const totalPriceWithDiscount = discountedPrice * product.quantity;
  
      return totalPriceWithDiscount;
    } else {
      // Si no hay descuento, simplemente devuelve el precio sin cambios
      return product.price * product.quantity;
    }
  }

  calculateTotalPriceOfBill(cartProducts: CartProduct[]): number {
    let total: number = 0;
    cartProducts.map((product: CartProduct) => {
      total += this.calculateTotalPriceWithDiscount(product);
    });
    return total;
  }

}
