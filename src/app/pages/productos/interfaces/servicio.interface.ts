import { Servicio } from "../models/Servicio"

export class ServicioInterface {

      static servJson(obj: Servicio) {
            return new ServicioInterface(
                  obj.CodigoServicio || 0,
                  obj.Nombre,
                  obj.Descripcion,
                  obj.Medida,
                  obj.PrecioUnitario,
                  obj.Estado
            )
      }
      constructor(
            public Codigo: number,
            public Nombre: string,
            public Descripcion: string,
            public Medida: string,
            public PrecioUnitario: number,
            public Estado: string
      ) { }
}