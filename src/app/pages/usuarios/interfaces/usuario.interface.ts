import { Usuario } from "../models/Usuario"

export class UsrInterface {

      static usrJson(obj: Usuario) {
            return new UsrInterface(
                  obj.CodigoUsuario || 0,
                  obj.Persona.IdPersona,
                  obj.Persona.Expedido || '',
                  obj.Persona.Complemento,
                  obj.Persona.Nombres,
                  obj.Persona.APaterno,
                  obj.Persona.AMaterno,
                  obj.Login,
                  obj.Rol.Descripcion,
                  '',
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
            public Login: string,
            public Rol: string,
            public Pswd: string,
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