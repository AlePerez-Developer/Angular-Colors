import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { ProductoInterface } from "../interfaces/producto.interface";
import { Producto } from "../models/Producto";


const URL = environment.urlServer;

@Injectable({
    providedIn: 'root'
})

export class ProductoService {

    constructor(private http: HttpClient) { }

    getProductos(): Observable<ProductoInterface[]> {
        let headers = new HttpHeaders({
            'auth-token': localStorage.getItem('auth-token') || ''
        })
        return this.http.get<Producto[]>(`${URL}/api/producto/`, { headers })
            .pipe(
                map(resp => {
                    return resp.map(producto => {
                         return ProductoInterface.prodJson(producto)
                    })
                })
            )
    }

    getProducto(id: number): Observable<Producto> {
        return this.http.get<Producto>(`${URL}/api/producto/${id}`)
    }

    addNewProducto(producto: ProductoInterface): Observable<any> {
        return this.http.post(`${URL}/api/producto/`, producto)
    }

    updateProducto(producto: ProductoInterface, id: number) {
        return this.http.put(`${URL}/api/producto/${id}`, producto)
    }

    deleteProducto(id: number): Observable<any> {
        return this.http.delete(`${URL}/api/producto/${id}`)
    }

    changeStatus(id: number): Observable<any> {
        return this.http.get(`${URL}/api/producto/change/${id}`)
    }

}