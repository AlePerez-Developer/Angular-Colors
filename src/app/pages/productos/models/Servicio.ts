export class Servicio {
    CodigoServicio?: number
    Nombre: string
    Descripcion: string
    Medida: string
    PrecioUnitario: number
    Estado: string

    constructor(Nombre: string, Descripcion: string, Medida: string, PrecioUnitario: number, Estado: string) {
        this.Nombre = Nombre
        this.Descripcion = Descripcion
        this.Medida = Medida
        this.PrecioUnitario = PrecioUnitario
        this.Estado = Estado;
    }
}