import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { ServicioInterface } from "../interfaces/servicio.interface";
import { Servicio } from "../models/Servicio";

const URL = environment.urlServer;

@Injectable({
    providedIn: 'root'
})

export class ServicioService {

    constructor(private http: HttpClient) { }

    getServicios(): Observable<ServicioInterface[]> {
        let headers = new HttpHeaders({
            'auth-token': localStorage.getItem('auth-token') || ''
        })
        return this.http.get<Servicio[]>(`${URL}/api/servicio/`, { headers })
            .pipe(
                map(resp => {
                    return resp.map(servicio => {
                         return ServicioInterface.servJson(servicio)
                    })
                })
            )
    }

    getServicio(id: number): Observable<Servicio> {
        return this.http.get<Servicio>(`${URL}/api/servicio/${id}`)
    }

    addNewServicio(servicio: ServicioInterface): Observable<any> {
        return this.http.post(`${URL}/api/servicio/`, servicio)
    }

    updateServicio(servicio: ServicioInterface, id: number) {
        return this.http.put(`${URL}/api/servicio/${id}`, servicio)
    }

    deleteServicio(id: number): Observable<any> {
        return this.http.delete(`${URL}/api/servicio/${id}`)
    }

    changeStatus(id: number): Observable<any> {
        return this.http.get(`${URL}/api/servicio/change/${id}`)
    }

}