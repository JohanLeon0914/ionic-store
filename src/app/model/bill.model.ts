import { CartProduct } from "./cartProduct.model";

export interface Bill {
    id: string,
    userEmail: string,
    cart: CartProduct[]
}