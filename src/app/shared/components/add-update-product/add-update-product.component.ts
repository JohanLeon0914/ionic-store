import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/model/product.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
})
export class AddUpdateProductComponent implements OnInit {
  @Input() product: Product;
  // user = {} as User;

  form = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
    ]),
    price: new FormControl(0, [Validators.required]),
    discount: new FormControl(0),
    image: new FormControl('', [Validators.required, Validators.minLength(4)]),
  });

  constructor(
    private utilSvc: UtilService,
    private firebasSvc: FirebaseService
  ) {}

  ngOnInit() {
    // this.user = this.utilSvc.getElementFromLocalStorage('user');
    if (this.product) {
      this.form.setValue(this.product);
      this.form.updateValueAndValidity();
    }
  }

  // crear o actualizar un producto
  submit() {
    if (this.form.valid) {
      if (this.product) {
        this.updateProducts();
      } else {
        this.createProducts();
      }
    }
  }

  createProducts() {
    this.utilSvc.presentLoading();
    //elimino el id de formulario para no mandarlo cuando cree la tarea
    delete this.form.value.id;

    this.firebasSvc.addDocument('products', this.form.value).then(
      (res) => {
        this.utilSvc.dismissModal({ success: true });
        this.utilSvc.presentToast({
          message: 'Producto agregado exitosamente',
          color: 'success',
          icon: 'checkmark-circle-outline',
          duration: 1500,
        });
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

  updateProducts() {
    this.utilSvc.presentLoading();
    //elimino el id de formulario para no mandarlo cuando cree el producto
    delete this.form.value.id;

    this.firebasSvc
      .updateDocument('products', this.product.id, this.form.value)
      .then(
        (res) => {
          this.utilSvc.dismissModal({ success: true });
          this.utilSvc.presentToast({
            message: 'Producto actualizado exitosamente',
            color: 'success',
            icon: 'checkmark-circle-outline',
            duration: 1500,
          });
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
}
