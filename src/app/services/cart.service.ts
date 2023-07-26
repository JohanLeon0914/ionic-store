import { Injectable } from '@angular/core';
import { Product } from '../model/product.model';
import { CartProduct } from '../model/cartProduct.model';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartProduct[] = [];
  constructor(private utilSvc: UtilService) { 
    // Recuperar el array del carrito del localStorage al iniciar el servicio
    const cartProductsFromLocalStorage = this.utilSvc.getElementFromLocalStorage('cartProducts');
    if (cartProductsFromLocalStorage) {
      this.cartItems = cartProductsFromLocalStorage;
    }
  }

  getCartItems(): CartProduct[] {
    return this.cartItems;
  }

  addToCart(product: Product): void {
    const existingItem: CartProduct = this.cartItems.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      const newProduct = { ...product, quantity: 1 };
      this.cartItems.push(newProduct);
    }
    this.utilSvc.setElementInLocalStorage('cartProducts', this.cartItems);
  }

  removeFromCart(productId: string): void {
    this.cartItems = this.cartItems.filter(item => item.id !== productId);
    this.utilSvc.setElementInLocalStorage('cartProducts', this.cartItems);
  }

}
