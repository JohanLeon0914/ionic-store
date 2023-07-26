import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from 'firebase/auth';
import { UtilService } from './util.service';
import {
  getAuth,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { Admin } from '../model/admin.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  
  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private utilSvc: UtilService
  ) {}

  //autenticacion

  login() {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();

    return signInWithPopup(auth, provider);
  }

  updateUser(user: any) {
    const auth = getAuth();
    return updateProfile(auth.currentUser, user);
  }

  getAuthState() {
    return this.auth.authState;
  }

  async signOut() {
    await this.auth.signOut();
    this.utilSvc.routerLink('/tabs/home');
    localStorage.removeItem('user');
  }

  isAdmin(): Observable<boolean> {
    return new Observable<boolean>(observer => {
      const usuarioActual = this.utilSvc.getElementFromLocalStorage('user');
  
      if (usuarioActual && usuarioActual.email) {
        const emailUsuarioActual = usuarioActual.email;
  
        this.db
          .collection<Admin>('admins', (ref) =>
            ref.where('email', '==', emailUsuarioActual)
          )
          .valueChanges()
          .subscribe((admins) => {
            if (admins && admins.length > 0) {
              // El usuario actual está en la colección 'admins'
              observer.next(true);
            } else {
              // El usuario actual no está en la colección 'admins'
              observer.next(false);
            }
            observer.complete();
          });
      } else {
        observer.next(false);
        observer.complete();
      }
    });
  }

  // firabase Base de datos

  getCollection(collectionName: string) {
    return this.db.collection(collectionName).valueChanges({ idField: 'id' });
  }

  // Método para agregar un documento a una colección en lugar de una subcolección
  addDocument(collectionName: string, object: any) {
    return this.db.collection(collectionName).add(object);
  }

  getSubcollecion(path: string, subCollectionName: string) {
    return this.db
      .doc(path)
      .collection(subCollectionName)
      .valueChanges({ idField: 'id' });
  }

  addSubcollecion(path: string, subCollectionName: string, object: any) {
    return this.db.doc(path).collection(subCollectionName).add(object);
  }

  // Método para actualizar un documento en una colección en lugar de una subcolección
  updateDocument(collectionName: string, documentId: string, object: any) {
    return this.db.collection(collectionName).doc(documentId).update(object);
  }

  // Método para eliminar un documento de una colección en lugar de una subcolección
  deleteDocument(collectionName: string, documentId: string) {
    return this.db.collection(collectionName).doc(documentId).delete();
  }
}
