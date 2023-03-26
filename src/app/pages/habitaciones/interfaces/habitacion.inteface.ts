import { Habitacion } from "../models/Habitacion"

export class HabitacionInterface{
    static habitacionJson(obj: Habitacion) {
        return new HabitacionInterface(
              obj.CodigoHabitacion || 0,
              obj.TipoHabitacion.Descripcion,
              obj.Descripcion,
              obj.WebRef,
              obj.Color,
              obj.Estado,
        )
  }

  constructor(
        public Codigo: number,
        public TipoHabitacion: string,
        public Descripcion: string,
        public WebRef: string,
        public Color: string,
        public Estado: string
  ) { }
}