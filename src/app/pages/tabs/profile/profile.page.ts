import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilService } from 'src/app/services/util.service';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user = {} as User;
  isAdmin: boolean = false;

  constructor(
    private firebaseSvc: FirebaseService,
    private utilSvc: UtilService
  ) {}

  ngOnInit() { }

  //todo lo que esta dentro de esta funcion se ejecuta cuando el usuario entra a la pagina
  ionViewWillEnter() {
    this.getUser();
    this.firebaseSvc.isAdmin().subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });
  }

  getUser() {
    return (this.user = this.utilSvc.getElementFromLocalStorage('user'));
  }

  loginWithGoogle() {
    this.firebaseSvc.login().then(async res => {
      this.utilSvc.setElementInLocalStorage('user', res.user);
      this.user = res.user;
      this.utilSvc.routerLink('/tabs/home')

      this.utilSvc.dismissLoading();

      this.utilSvc.presentToast({
        message: `Te damos la bienvenida `,
        duration: 1500,
        color: 'primary',
        icon: 'person-outline'
      });
      

    }, error => {
      this.utilSvc.dismissLoading();
      this.utilSvc.presentToast({
        message: error,
        duration: 5000,
        color: 'warning',
        icon: 'alert-circle-outline'
      });
    });
  }

  signOut() {
    this.utilSvc.presentAlert({
      header: 'Cerrar Sesión!',
      message: '¿Estas seguro que deseas cerrar sesíon?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Si, cerrar',
          handler: () => {
            this.firebaseSvc.signOut();
          },
        },
      ],
    });
  }
}
