import { Habitacion } from "./Habitacion";

export class Cama {
    CodigoCama?: number;
    Habitacion: Habitacion;
    Descripcion: string;
    Precio: number;
    Color: string;
    Estado: string;

    constructor(Habitacion: Habitacion, Descripcion: string, Precio: number, Color: string, Estado: string) {
        this.Habitacion = Habitacion
        this.Descripcion = Descripcion
        this.Precio = Precio
        this.Color = Color
        this.Estado = Estado
    }

}