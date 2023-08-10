import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService } from '../app.service';
import { User } from './user.model';
import { initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword, getAuth, getIdToken, signInWithEmailAndPassword } from 'firebase/auth';
import { environment } from '../environment';


const firebaseApp = initializeApp(environment.firebaseConfig);
const auth = getAuth(firebaseApp);


@Injectable({
    providedIn: 'root'
})
export class UserService extends AppService {

    getAll(): Observable<User[]> {
        const url: string = `${this.baseUrl}/users`;
        return this.http.get<User[]>(url);
    }

    async signinWithFirebase(email: string, password: string): Promise<Observable<User>> {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const idToken = await getIdToken(user);
        localStorage.setItem('firebaseIdToken', idToken);
        const url: string = `${this.baseUrl}/auth/login`;
        return this.http.post<User>(url, {idToken, password});
    }

    async registerWithFirebase(email: string, password: string): Promise<Observable<User>> {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const idToken = await getIdToken(user);
        localStorage.setItem('firebaseIdToken', idToken);
        const url: string = `${this.baseUrl}/auth/signup`;
        return this.http.post<User>(url, {email, idToken, password});
    }
}
