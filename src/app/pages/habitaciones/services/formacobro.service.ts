import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { FormaCobro } from "../models/FormaCobro";

const URL = environment.urlServer;

@Injectable({
    providedIn: 'root'
})
export class FormaCobroService {
    constructor(private http: HttpClient) { }

    getFormas(): Observable<any> {
        let headers = new HttpHeaders({
            'auth-token': localStorage.getItem('auth-token') || ''
        })
        return this.http.get<FormaCobro[]>(`${URL}/api/formac/`,{headers});
    }
}