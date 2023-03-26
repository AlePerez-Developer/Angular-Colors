import { Producto } from "../models/Producto"

export class ProductoInterface {

      static prodJson(obj: Producto) {
            return new ProductoInterface(
                  obj.CodigoProducto || 0,
                  obj.Nombre,
                  obj.Descripcion,
                  obj.Categoria.Descripcion,
                  obj.PrecioCompra,
                  obj.PrecioVenta,
                  obj.Estado
            )
      }
      constructor(
            public Codigo: number,
            public Nombre: string,
            public Descripcion: string,
            public Categoria: string,
            public PrecioCompra: number,
            public PrecioVenta: number,
            public Estado: string
      ) { }
}