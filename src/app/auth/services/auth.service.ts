import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LoginForm } from "../interfaces/login-form.interface";
import { environment } from "src/environments/environment";
import { tap } from "rxjs/operators";


const URL = environment.urlServer;

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient) { }

    login(formData: LoginForm) {
        return this.http.post(`${URL}/api/usr/auth`, formData).pipe(tap((res: any) => {
            localStorage.setItem('auth-token', res.token)
        }));
    }

}