import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Usuario } from "../models/Usuario";
import { UsrInterface } from "../interfaces/usuario.interface";


const URL = environment.urlServer;

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {

    constructor(private http: HttpClient) { }

    getUsuarios(): Observable<UsrInterface[]> {
        let headers = new HttpHeaders({
            'auth-token': localStorage.getItem('auth-token') || ''
        })
        return this.http.get<Usuario[]>(`${URL}/api/usr/`, { headers })
            .pipe(
                map(resp => {
                    return resp.map(usr => {
                         return UsrInterface.usrJson(usr)
                    })
                })
            )
    }

    getUSuario(id: number): Observable<any> {
        return this.http.get(`${URL}/api/usr/${id}`)
    }

    addNewUsuario(usuario: any): Observable<any> {
        return this.http.post(`${URL}/api/usr/`, usuario)
    }

    updateUsuario(usuario: any, id: number) {
        return this.http.put(`${URL}/api/usr/${id}`, usuario)
    }

    deleteUsuario(id: number): Observable<any> {
        return this.http.delete(`${URL}/api/usr/${id}`)
    }

    changeStatus(id: number): Observable<any> {
        return this.http.get(`${URL}/api/usr/change/${id}`)
    }

}