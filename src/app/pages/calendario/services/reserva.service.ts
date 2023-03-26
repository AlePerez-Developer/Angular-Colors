import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { environment } from "src/environments/environment";
import { ReservaInterface } from "../interfaces/reserva.interface";
import { Reserva } from "../models/Reserva";

const URL = environment.urlServer;

@Injectable({
    providedIn: 'root'
})

export class ReservaService {
    constructor(private http: HttpClient) { }

    getReservasByCama(id: number): Observable<ReservaInterface[]> {
        let headers = new HttpHeaders({
            'auth-token': localStorage.getItem('auth-token') || ''
        })
        return this.http.get<Reserva[]>(`${URL}/api/reserva/byCama/${id}`,{headers})
        .pipe(
            map(resp => {
                return resp.map(data =>{
                    return ReservaInterface.reservaJson(data)
                })
            })
        )
    }

    getReservasById(id: number): Observable<any> {
        return this.http.get(`${URL}/api/reserva/${id}`)
    }

    addNewReserva(reserva: any): Observable<any> {
        return this.http.post(`${URL}/api/reserva/`, reserva)
    }

    updateReserva(reserva: any, id: number): Observable<any>{
        return this.http.put(`${URL}/api/reserva/${id}`, reserva)
    }

    checkin(id: number): Observable<any> {
        return this.http.get(`${URL}/api/reserva/check/${id}`)
    }


    deleteReserva(id: number): Observable<any>{
        return this.http.delete(`${URL}/api/reserva/${id}`)
    }
}