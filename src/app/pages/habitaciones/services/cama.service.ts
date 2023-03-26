import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { environment } from "src/environments/environment";
import { CamaInterface } from "../interfaces/cama.interface";
import { Cama } from "../models/Cama";


const URL = environment.urlServer;

@Injectable({
    providedIn: 'root'
})
export class CamaService {
    constructor(private http: HttpClient) { }

    getCamas(): Observable<CamaInterface[]> {
        let headers = new HttpHeaders({
            'auth-token': localStorage.getItem('auth-token') || ''
        })
        return this.http.get<Cama[]>(`${URL}/api/cama/`,{headers})
        .pipe(
            map(resp => {
                return resp.map(cama =>{
                    return CamaInterface.camaJson(cama)
                })
            })
        )
    }

    getCamasbyHabitacion(id: number): Observable<CamaInterface[]> {
        let headers = new HttpHeaders({
            'auth-token': localStorage.getItem('auth-token') || ''
        })
        return this.http.get<Cama[]>(`${URL}/api/cama/byHab/${id}`,{headers})
        .pipe(
            map(resp => {
                return resp.map(cama =>{
                    return CamaInterface.camaJson(cama)
                })
            })
        )
    }

    getCama(id: number): Observable<any> {
        return this.http.get(`${URL}/api/cama/${id}`)
    }

    addNewCama(cama: any): Observable<any> {
        return this.http.post(`${URL}/api/cama/`, cama)
    }

    updateCama(cama: any, id: number): Observable<any>{
        return this.http.put(`${URL}/api/cama/${id}`, cama)
    }

    deleteCama(id: number): Observable<any> {
        return this.http.delete(`${URL}/api/cama/${id}`)
    }

    changeStatus(id: number): Observable<any> {
        return this.http.get(`${URL}/api/cama/change/${id}`)
    }
}