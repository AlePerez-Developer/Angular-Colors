import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { environment } from "src/environments/environment";
import { HabitacionInterface } from "../interfaces/habitacion.inteface";
import { Habitacion } from "../models/Habitacion";

const URL = environment.urlServer;

@Injectable({
    providedIn: 'root'
})
export class HabitacionService {
    constructor(private http: HttpClient) { }

    getHabitaciones(): Observable<any> {
        let headers = new HttpHeaders({
            'auth-token': localStorage.getItem('auth-token') || ''
        })
        return this.http.get<Habitacion[]>(`${URL}/api/habitacion/`,{headers})
        .pipe(
            map(resp => {
                return resp.map(hab =>{
                    return HabitacionInterface.habitacionJson(hab)
                })
            })
        )
    }

    getHabitacion(id: number): Observable<any> {
        return this.http.get(`${URL}/api/habitacion/${id}`)
    }

    addNewHabitacion(habitacion: any): Observable<any> {
        return this.http.post(`${URL}/api/habitacion/`, habitacion)
    }

    updateHabitacion(habitacion: any, id: number): Observable<any>{
        return this.http.put(`${URL}/api/habitacion/${id}`, habitacion)
    }

    deleteHabitacion(id: number): Observable<any> {
        return this.http.delete(`${URL}/api/habitacion/${id}`)
    }

    changeStatus(id: number): Observable<any> {
        return this.http.get(`${URL}/api/habitacion/change/${id}`)
    }
}