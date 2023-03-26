import { Categoria } from "./Categoria"

export class Producto {
    CodigoProducto?: number
    Categoria: Categoria
    Nombre: string
    Descripcion: string
    PrecioCompra: number
    PrecioVenta: number
    Estado: string

    constructor(Categoria: Categoria, Nombre: string, Descripcion: string, PrecioCompra: number, PrecioVenta: number, Estado: string) {
        this.Categoria = Categoria
        this.Nombre = Nombre
        this.Descripcion = Descripcion
        this.PrecioCompra = PrecioCompra
        this.PrecioVenta = PrecioVenta
        this.Estado = Estado;
    }
}