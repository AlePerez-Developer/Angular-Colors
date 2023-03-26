export class FormaCobro{
    CodigoFormaCobro?: number;
    Descripcion: string;
    Estado: string;

    constructor(Descripcion: string, Estado: string) {
        this.Descripcion = Descripcion
        this.Estado = Estado
    }

}