import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { UsrInterface } from "../interfaces/usuario.interface";
import { PersonaInterface } from "../interfaces/persona.interface";
import { Persona } from "../models/Persona";


const URL = environment.urlServer;

@Injectable({
    providedIn: 'root'
})
export class PersonaService {

    constructor(private http: HttpClient) { }

    getPersonas(): Observable<PersonaInterface[]> {
        let headers = new HttpHeaders({
            'auth-token': localStorage.getItem('auth-token') || ''
        })
        return this.http.get<Persona[]>(`${URL}/api/persona/`, { headers })
            .pipe(
                map(resp => {
                    return resp.map(persona => {
                         return PersonaInterface.usrJson(persona)
                    })
                })
            )
    }

    getPersona(id: number): Observable<any> {
        return this.http.get(`${URL}/api/persona/${id}`)
    }

    addNewPersona(persona: any): Observable<any> {
        return this.http.post(`${URL}/api/persona/`, persona)
    }

    updatePersona(persona: any, id: number): Observable<any> {
        return this.http.put(`${URL}/api/persona/${id}`, persona)
    }

    deletePersona(id: number): Observable<any> {
        return this.http.delete(`${URL}/api/persona/${id}`)
    }

    changeStatus(id: number): Observable<any> {
        return this.http.get(`${URL}/api/persona/change/${id}`)
    }

}