import { CartProduct } from "./cartProduct.model";

export interface Bill {
    userEmail: string,
    cart: CartProduct[]
}