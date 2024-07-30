import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { TipoHabitacion } from "../models/TipoHabitacion";
import { TipoInterface } from "../interfaces/tipo.interface";

const URL = environment.urlServer;

@Injectable({
    providedIn: 'root'
})
export class TipoHabitacionService {
    constructor(private http: HttpClient) { }

    getTipos(): Observable<any> {
        let headers = new HttpHeaders({
            'auth-token': localStorage.getItem('auth-token') || ''
        })
        return this.http.get<TipoHabitacion[]>(`${URL}/api/tipoh/`,{headers});
    }

    getTipo(id: number): Observable<any> {
        return this.http.get(`${URL}/api/tipoh/${id}`)
    }

    addNewTipo(tipohabitacion: TipoInterface): Observable<any> {
        return this.http.post(`${URL}/api/tipoh/`, tipohabitacion)
    }

    updateTipo(tipohabitacion: any, id: number): Observable<any>{
        return this.http.put(`${URL}/api/tipoh/${id}`, tipohabitacion)
    }

    deleteTipo(id: number): Observable<any> {
        return this.http.delete(`${URL}/api/tipoh/${id}`)
    }

    changeStatus(id: number): Observable<any> {
        return this.http.get(`${URL}/api/tipoh/change/${id}`)
    }
}