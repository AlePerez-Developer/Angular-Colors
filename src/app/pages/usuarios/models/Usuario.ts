import { Persona } from "./Persona";
import { Rol } from "./Rol";


export class Usuario {
    CodigoUsuario?: number;
    Login: string;
    Persona: Persona;
    Rol: Rol;
    Estado: string;
    FechaCreacion?: Date


    constructor(Login: string, Estado: string, Persona: Persona, Rol: Rol) {
        this.Login = Login;
        this.Estado = Estado;
        this.Persona = Persona;
        this.Rol = Rol;
    }

}