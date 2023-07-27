import { Component, OnInit } from '@angular/core';
import { CartProduct } from 'src/app/model/cartProduct.model';
import { CartService } from 'src/app/services/cart.service';
import { UtilService } from 'src/app/services/util.service';
import { BillComponent } from 'src/app/shared/components/bill/bill.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  cartProducts: CartProduct[] = [];
  constructor(private cartSvc: CartService, private utilSvc: UtilService) {}

  ngOnInit() {
    this.getCartProducts();
  }

  getCartProducts() {
    this.cartProducts = this.cartSvc.getCartItems();
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

  async openModalBuyProducts() {
    let res = await this.utilSvc.presentModal({
      component: BillComponent,
      cssClass: 'add-update-modal',
    });
    //al cerrar el modal, este puede enviarnos una respuesta, la cual se esta enviando desde el componente addUpdateProduct llamada success, si la tiene, actualizamos la lista de tareas
    if (res && res.success) {
      this.getCartProducts();
    }
  }

  confirmDeleteProduct(product: CartProduct) {
    this.utilSvc.presentAlert({
      header: 'Eliminar',
      message: '¿Quieres eliminar este producto de tu carrito?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        }, {
          text: 'Si, eliminar',
          handler: () => {
            this.deleteCartProduct(product);
          }
        }
      ]
    })
  }

  decreaseQuantity(product: CartProduct) {
    if(product.quantity > 1) {
      this.cartSvc.removeFromCart(product.id);
    } else {
      this.confirmDeleteProduct(product)
    }
    this.getCartProducts();
  }

  increaseQuantity(product: CartProduct) {
    this.cartSvc.addToCart(product);
    this.getCartProducts();
  }

  deleteCartProduct(product: CartProduct) {
    this.cartSvc.removeFromCart(product.id);
    this.getCartProducts();
    this.utilSvc.presentToast({
      message: 'Producto eliminado del carrito',
      color: 'success',
      icon: 'checkmark-circle-outline',
      duration: 1500
    });
  }
}
