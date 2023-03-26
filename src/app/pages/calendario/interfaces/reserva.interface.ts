
import { Reserva } from "../models/Reserva"

export class ReservaInterface {
    static reservaJson(obj: Reserva) {
        return new ReservaInterface(
            obj.CodigoReserva || 0,
            obj.Cama.CodigoCama || 0,
            `${obj.Persona.APaterno} ${obj.Persona.AMaterno} ${obj.Persona.Nombres}`,
            obj.Cama.Descripcion,
            obj.LugarProcedencia,
            obj.RefWeb,
            obj.FechaInicio,
            obj.FechaFin,
            obj.Estado,
        )
    }

    constructor(
        public Codigo: number,
        public CodigoCama: number,
        public Persona: string,
        public Cama: string,
        public LugarProcedencia: string,
        public RefWeb: string,
        public FechaInicio: Date,
        public FechaFin: Date,
        public Estado: string
    ) { }
}