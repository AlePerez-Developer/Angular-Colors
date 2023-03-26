import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { CategoriaInterface } from '../../interfaces/categoria.interface';
import { ProductoInterface } from '../../interfaces/producto.interface';
import { CategoriaService } from '../../services/categoria.service';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
  providers: [NgbModalConfig, NgbModal],
})

export class ProductosComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  titulo: string
  btnstatus: boolean

  formProducto: FormGroup

  listaCategorias: CategoriaInterface[] = []

  dataSource!: MatTableDataSource<ProductoInterface>;
  displayedColumns = ['position', 'Categoria', 'Nombre', 'Descripcion', 'PrecioCompra', 'PrecioVenta', 'estado', 'acciones'];

  constructor(private fb: FormBuilder,
    private toastr: ToastrService,
    private _productoservice: ProductoService,
    private _categoriaservice: CategoriaService,
    private _modalservice: NgbModal,
    _modalconfig: NgbModalConfig) {
    this.titulo = 'Nuevo Producto'
    this.btnstatus = false

    this.formProducto = this.fb.group({
      codigo: '',
      Categoria: ['', [Validators.required]],
      Nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      Descripcion: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      PrecioCompra: ['', [Validators.required]],
      PrecioVenta: ['', [Validators.required]],
    })

    _modalconfig.backdrop = 'static'
    _modalconfig.keyboard = false
  }

  ngOnInit(): void {
    this.listarProductos()
    this.listarCategorias()
  }

  listarProductos() {
    this._productoservice.getProductos().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, err => {
      this.toastr.error(`No se pudo listar los productos registrados, ${err}`);
    })
  }

  listarCategorias() {
    this._categoriaservice.getCategorias().subscribe((data) => {
      this.listaCategorias = data
    })
  }

  open(content: any) {
    this._modalservice.open(content, { size: 'xl', backdropClass: 'light-blue-backdrop', centered: true });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  newProdClick() {
    this.titulo = 'Nuevo Producto'
    this.btnstatus = !this.btnstatus;
    this.formProducto.reset()
  }

  getProducto(id: number) {
    this.newProdClick()
    this.titulo = 'Actualizar Producto'
    this._productoservice.getProducto(id).subscribe(producto => {
      this.formProducto.setValue({
        codigo: id,
        Categoria: producto.Categoria.CodigoCategoria,
        Nombre: producto.Nombre,
        Descripcion: producto.Descripcion,
        PrecioCompra: producto.PrecioCompra,
        PrecioVenta: producto.PrecioVenta
      })
    }, err => {
      this.toastr.error(`No se pudo recuperar los datos del producto, ${err.error.msg}`);
    })
  }

  procesarGuardado() {
    const productoInterface = new ProductoInterface(
      0,
      this.formProducto.controls['Nombre'].value,
      this.formProducto.controls['Descripcion'].value,
      this.formProducto.controls['Categoria'].value || '',
      this.formProducto.controls['PrecioCompra'].value,
      this.formProducto.controls['PrecioVenta'].value || '',
      'V'
    )
    if (!this.formProducto.controls['codigo'].value)
      this.agregarProducto(productoInterface)
    else
      this.actualizarProducto(productoInterface, this.formProducto.controls['codigo'].value)
  }

  agregarProducto(producto: ProductoInterface) {
    Swal.fire({
      title: 'Confirmacion',
      text: "¿Está seguro de registrar el nuevo producto?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '<i class="fa fa-check-circle-o"></i> Continuar',
      cancelButtonText: '<i class="fa fa-times-circle-o"></i> Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._productoservice.addNewProducto(producto).subscribe(rta => {
          this.toastr.success(rta.msg);
          this.newProdClick()
          this.listarProductos()
        }, err => {
          this.toastr.error(`Ocurrio un error al agregar el producto, ${err.error.msg}`);
        })
      }
    })
  }

  actualizarProducto(producto: ProductoInterface, id: number) {
    Swal.fire({
      title: 'Confirmacion',
      text: "¿Está seguro de actualizar el producto?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '<i class="fa fa-check-circle-o"></i> Continuar',
      cancelButtonText: '<i class="fa fa-times-circle-o"></i> Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._productoservice.updateProducto(producto, id).subscribe((rta: any) => {
          this.toastr.success(rta.msg);
          this.newProdClick()
          this.listarProductos()
        }, err => {
          this.toastr.error(`Ocurrio un error al actualizar el producto, ${err.error.msg}`);
        })
      }
    })
  }

  deleteProducto(id: number) {
    Swal.fire({
      title: 'Confirmacion',
      text: "¿Está seguro de eliminar el producto?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '<i class="fa fa-check-circle-o"></i> Continuar',
      cancelButtonText: '<i class="fa fa-times-circle-o"></i> Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._productoservice.deleteProducto(id).subscribe(rta => {
          this.toastr.success(rta.msg);
          this.listarProductos()
        }, err => {
          this.toastr.error(`Ocurrio un error al eliminar el producto, ${err.error.msg}`);
        })
      }
    })
  }

  changeStatus(id: any) {
    this._productoservice.changeStatus(id).subscribe(rta => {
      this.toastr.success(rta.msg);
      this.listarProductos()
    }, err => {
      this.toastr.error(`Ocurrio un error al cambiar el estado el producto, ${err.error.msg}`);
    })
  }

  isFieldValid(field: string) {
    if (this.formProducto.get(field)?.touched || this.formProducto.get(field)?.dirty) {
      if (!this.formProducto.get(field)?.valid) {
        return 'is-invalid'
      } else {
        return 'is-valid'
      }
    } else
      return ''
  }

  getErrorMsg(field: string) {
    if (!this.formProducto.controls[field].valid) {
      if (this.formProducto.get(field)?.errors?.['required'])
        return `El campo es obligatorio`
      if (this.formProducto.get(field)?.errors?.['minlength'])
        return `El campo debe tener al menos ${this.formProducto.get(field)?.errors?.['minlength'].requiredLength} caracteres`
      if (this.formProducto.get(field)?.errors?.['maxlength'])
        return `El campo no debe tener mas de ${this.formProducto.get(field)?.errors?.['maxlength'].requiredLength} caracteres`
      return 'error no controlado'
    } else
      return ''
  }

}
