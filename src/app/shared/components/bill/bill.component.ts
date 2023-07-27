import { Component, OnInit } from '@angular/core';
import { User } from 'firebase/auth';
import { Bill } from 'src/app/model/bill.model';
import { CartProduct } from 'src/app/model/cartProduct.model';
import { CartService } from 'src/app/services/cart.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss'],
})
export class BillComponent implements OnInit {
  cartProducts: CartProduct[] = [];
  user = {} as User;
  constructor(
    private cartSvc: CartService,
    private utilSvc: UtilService,
    private firebaseSvc: FirebaseService
  ) {}

  ngOnInit() {
    this.getCartProducts();
    this.getUser();
  }

  getCartProducts() {
    this.cartProducts = this.cartSvc.getCartItems();
  }

  getUser() {
    return (this.user = this.utilSvc.getElementFromLocalStorage('user'));
  }

  buyProducts() {
    let bill: Bill = {
      userEmail: this.user.email,
      cart: this.cartProducts
    }
    this.utilSvc.presentLoading();
    this.firebaseSvc.addDocument('bills', bill).then(
      (res) => {
        this.utilSvc.dismissModal({ success: true });
        this.utilSvc.presentToast({
          message: 'Compra realizada exitosamente',
          color: 'success',
          icon: 'checkmark-circle-outline',
          duration: 1500,
        });
        this.cartSvc.cleanCart();
        this.utilSvc.dismissLoading();
      },
      (error) => {
        this.utilSvc.dismissModal({ success: true });
        this.utilSvc.presentToast({
          message: error,
          color: 'warning',
          icon: 'alert-circle-outline',
          duration: 5000,
        });
        this.utilSvc.dismissLoading();
      }
    );
  }

  confirmPurchase() {
    if (this.user) {
      this.utilSvc.presentAlert({
        header: 'Comprar',
        message: '¿Quieres comprar los productos de tu carrito?',
        mode: 'ios',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
          },
          {
            text: 'Si, comprar',
            handler: () => {
              this.buyProducts();
            },
          },
        ],
      });
    } else {
      this.utilSvc.presentAlert({
        header: 'Comprar',
        message: 'Debes iniciar sesión antes de realizar alguna compra',
        mode: 'ios',
      });
    }
  }

  calculateTotalPriceWithDiscount(product: CartProduct): number {
    if (product.discount > 0) {
      // Calcula el precio con descuento aplicando el porcentaje de descuento
      const discountedPrice =
        product.price - product.price * (product.discount / 100);

      // Calcula el precio total con descuento tomando en cuenta la cantidad de productos en el carrito
      const totalPriceWithDiscount = discountedPrice * product.quantity;

      return totalPriceWithDiscount;
    } else {
      // Si no hay descuento, simplemente devuelve el precio sin cambios
      return product.price * product.quantity;
    }
  }

  calculateTotalPriceOfBill(): number {
    let total: number = 0;
    this.cartProducts.map((product: CartProduct) => {
      total += this.calculateTotalPriceWithDiscount(product);
    });
    return total;
  }
}
