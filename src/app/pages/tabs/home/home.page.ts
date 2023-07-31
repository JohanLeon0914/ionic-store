import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/model/product.model';
import { CartService } from 'src/app/services/cart.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilService } from 'src/app/services/util.service';
import { AddUpdateProductComponent } from 'src/app/shared/components/add-update-product/add-update-product.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  loading: boolean = false;
  isAdmin: boolean = false;
  search: string = '';

  products: Product[] = [];

  constructor(
    private firebaseSvc: FirebaseService,
    private utilSvc: UtilService,
    private cartSvc: CartService,
  ) {}

  ngOnInit() { }

  ionViewWillEnter() {
    this.firebaseSvc.isAdmin().subscribe((isAdmin) => {
      if (isAdmin) {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }
    });
    this.getTasks();
  }

  searchProduct(event) {
    this.search = event.target.value;
    this.getTasks();
  }
  

  getTasks() {
    this.loading = true;
  
    let sub = this.firebaseSvc.getCollection('products').subscribe({
      next: (res: Product[]) => {
        if (this.search) {
          // Aplicar el filtro para obtener solo los productos que coincidan con la búsqueda
          this.products = res.filter((product: Product) => {
            // Aquí debes ajustar el criterio de búsqueda según la estructura de tus objetos Product
            return product.name.toLowerCase().includes(this.search.toLowerCase());
          });
        } else {
          // Si no hay término de búsqueda, asignar todos los productos sin filtrar
          this.products = res;
        }
        
        sub.unsubscribe();
        this.loading = false;
      },
    });
  }

  calculateDiscount(product: Product): number {
    if(product.discount > 0) {
     // Calcula el precio con descuento aplicando el porcentaje de descuento
    const discountedPrice = product.price - (product.price * (product.discount / 100));
    return discountedPrice;
    } else {
      return product.price;
    }
  }

  addToCart(product: Product) {
    this.cartSvc.addToCart(product);
    this.utilSvc.presentToast({
      message: 'Producto agregado al carrito',
      color: 'success',
      icon: 'checkmark-circle-outline',
      duration: 1500
    });
  }

  async addOrUpdateProduct(product?: Product) {
    let res = await this.utilSvc.presentModal({
      component: AddUpdateProductComponent,
      componentProps: { product },
      cssClass: 'add-update-modal',
    });
    //al cerrar el modal, este puede enviarnos una respuesta, la cual se esta enviando desde el componente addUpdateProduct llamada success, si la tiene, actualizamos la lista de tareas
    if (res && res.success) {
      this.getTasks();
    }
  }

  confirmDeleteProduct(product: Product) {
    this.utilSvc.presentAlert({
      header: 'Eliminar',
      message: '¿Quieres eliminar este producto?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        }, {
          text: 'Si, eliminar',
          handler: () => {
            this.deleteProduct(product);
          }
        }
      ]
    })
  }

  deleteProduct(product: Product) {
    this.utilSvc.presentLoading();
    
    this.firebaseSvc.deleteDocument('products', product.id).then(res => {
      this.utilSvc.presentToast({
        message: 'Producto eliminada exitosamente',
        color: 'success',
        icon: 'checkmark-circle-outline',
        duration: 1500
      });
      this.getTasks();
      this.utilSvc.dismissLoading();
    }, error => {
      this.utilSvc.dismissModal({ success: true });
      this.utilSvc.presentToast({
        message: error,
        color: 'warning',
        icon: 'alert-circle-outline',
        duration: 5000
      });
      this.utilSvc.dismissLoading();
    });
  }

}
