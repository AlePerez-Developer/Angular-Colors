import { Cama } from "../../habitaciones/models/Cama";
import { Persona } from "../../usuarios/models/Persona";

export class Reserva {
    CodigoReserva: number;
    Persona: Persona;
    Cama: Cama;
    LugarProcedencia: string;
    RefWeb: string;
    FechaInicio: Date;
    FechaFin: Date;
    Estado: string;

    constructor(CodigoReserva: number, Persona: Persona, Cama: Cama, LugarProcedencia: string, RefWeb: string, FechaInicio: Date, FechaFin: Date, Estado: string) {
        this.CodigoReserva = CodigoReserva;
        this.Persona = Persona;
        this.Cama = Cama;
        this.LugarProcedencia = LugarProcedencia;
        this.RefWeb = RefWeb;
        this.FechaInicio = FechaInicio;
        this.FechaFin = FechaFin;
        this.Estado = Estado;
    }
}