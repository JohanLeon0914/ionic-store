import { Component, OnInit } from '@angular/core';
import { CartProduct } from 'src/app/model/cartProduct.model';
import { CartService } from 'src/app/services/cart.service';
import { UtilService } from 'src/app/services/util.service';

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

  calculateDiscount(product: CartProduct): number {
    if (product.discount > 0) {
      // Calcula el precio con descuento aplicando el porcentaje de descuento
      const discountedPrice =
        product.price - product.price * (product.discount / 100);
      return discountedPrice;
    } else {
      return product.price;
    }
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
