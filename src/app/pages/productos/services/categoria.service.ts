import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { CategoriaInterface } from "../interfaces/categoria.interface";
import { Categoria } from "../models/Categoria";



const URL = environment.urlServer;

@Injectable({
    providedIn: 'root'
})

export class CategoriaService {

    constructor(private http: HttpClient) { }

    getCategorias(): Observable<CategoriaInterface[]> {
        let headers = new HttpHeaders({
            'auth-token': localStorage.getItem('auth-token') || ''
        })
        return this.http.get<Categoria[]>(`${URL}/api/categoria/`, { headers })
            .pipe(
                map(resp => {
                    return resp.map(categoria => {
                        return CategoriaInterface.categoriaJson(categoria)
                    })
                })
            )
    }

    getCategoria(id: number): Observable<CategoriaInterface> {
        return this.http.get<Categoria>(`${URL}/api/categoria/${id}`)
            .pipe(map(categoria => {
                return CategoriaInterface.categoriaJson(categoria)
            }))
    }

    addNewCategoria(categoria: CategoriaInterface): Observable<any> {
        return this.http.post(`${URL}/api/categoria/`, categoria)
    }

    updateCategoria(categoria: CategoriaInterface, id: number): Observable<any> {
        return this.http.put(`${URL}/api/categoria/${id}`, categoria)
    }

    deleteCategoria(id: number): Observable<any> {
        return this.http.delete(`${URL}/api/categoria/${id}`)
    }

    changeStatus(id: number): Observable<any> {
        return this.http.get(`${URL}/api/categoria/change/${id}`)
    }

}