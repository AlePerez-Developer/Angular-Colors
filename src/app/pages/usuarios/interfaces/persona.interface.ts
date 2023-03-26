import { Persona } from "../models/Persona"

export class PersonaInterface {

      static usrJson(obj: Persona) {
            return new PersonaInterface(
                  obj.CodigoPersona || 0,
                  obj.IdPersona,
                  obj.Expedido || '',
                  obj.Complemento,
                  obj.Nombres,
                  obj.APaterno,
                  obj.AMaterno,
                  obj.Estado
            )
      }

      constructor(
            public Codigo: number,
            public IdPersona: string,
            public Expedido: string,
            public Complemento: string,
            public Nombres: string,
            public APaterno: string,
            public AMaterno: string,
            public Estado: string
      ) { }

      get NombreCompleto() {
            return `${this.APaterno} ${this.AMaterno} ${this.Nombres}`
      }

      get Ci() {
            if (this.Complemento !== '')
                  return `${this.IdPersona}-${this.Complemento} ${this.Expedido}`
            else
                  return `${this.IdPersona} ${this.Expedido}`
      }

}