export class TipoHabitacion{
    CodigoTipoHabitacion?: number;
    Descripcion: string;
    Estado: string;

    constructor(Descripcion: string, Estado: string) {
        this.Descripcion = Descripcion
        this.Estado = Estado
    }

}