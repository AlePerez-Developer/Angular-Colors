export class Persona {
    CodigoPersona?: number;
    IdPersona: string;
    Complemento: string;
    Expedido: string;
    Nombres: string;
    APaterno: string;
    AMaterno: string;
    Estado: string;

    constructor(Nombres: string, IdPersona: string, Complemento: string, Expedido: string, APaterno: string, AMaterno: string, Estado: string) {
        this.IdPersona = IdPersona;
        this.Complemento = Complemento;
        this.Expedido = Expedido;
        this.Nombres = Nombres;
        this.APaterno = APaterno;
        this.AMaterno = AMaterno;
        this.Estado = Estado
    }
}