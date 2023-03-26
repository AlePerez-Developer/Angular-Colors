import { TipoHabitacion } from "./TipoHabitacion";

export class Habitacion {
    CodigoHabitacion: number;
    TipoHabitacion: TipoHabitacion;
    Descripcion: string;
    WebRef: string;
    Color: string;
    Estado: string;

    constructor(CodigoHabitacion: number, TipoHabitacion: TipoHabitacion, Descripcion: string, WebRef: string, Color: string, Estado: string) {
        this.CodigoHabitacion = CodigoHabitacion
        this.TipoHabitacion = TipoHabitacion;
        this.Descripcion = Descripcion;
        this.WebRef = WebRef
        this.Color = Color
        this.Estado = Estado;
    }

}