import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AppService} from "../app.service";

@Injectable({
    providedIn: 'root'
})
export class UserService extends AppService {

    getUsers(): Observable<any> {
        const url: string = `${this.baseUrl}/users`;
        return this.http.get<any>(url);
    }
}
