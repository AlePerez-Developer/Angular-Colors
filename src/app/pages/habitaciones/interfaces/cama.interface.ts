import { Cama } from "../models/Cama";

export class CamaInterface{
    static camaJson(obj: Cama) {
        return new CamaInterface(
              obj.CodigoCama || 0,
              obj.Habitacion.Descripcion,
              obj.Descripcion,
              obj.Precio,
              obj.Color,
              obj.Estado,
        )
  }

  constructor(
        public Codigo: number,
        public Habitacion: string,
        public Descripcion: string,
        public Precio: number,
        public Color: string,
        public Estado: string
  ) { }
}