import { Categoria } from "../models/Categoria"

export class CategoriaInterface {

      static categoriaJson(obj: Categoria) {
            return new CategoriaInterface(
                  obj.CodigoCategoria || 0,
                  obj.Descripcion,
                  obj.Estado
            )
      }

      constructor(
            public Codigo: number,
            public Descripcion: string,
            public Estado: string
      ) { }
}