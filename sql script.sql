create table Estados(
CodigoEstado char(1) primary key,
Descripcion varchar(200) not null
)

go

insert into Estados values('C','Caduco')
insert into Estados values('V','Vigente')

go

create table Roles(
CodigoRol int primary key identity(1,1),
Descripcion varchar(200) not null,
FechaCreacion datetime default getdate() not null,
Estado char(1) not null,

foreign key (Estado) references Estados(CodigoEstado)
)

go

insert into Roles values('Administrador',default,'V')

go

create table Personas(
CodigoPersona int primary key identity(1,1),
IdPersona varchar(20) not null,
Complemento varchar(5),
Expedido varchar(5) not null,
Nombres Varchar(100) not null,
APaterno Varchar(100),
AMaterno Varchar(100),
FechaCreacion datetime default getdate() not null,
Estado char(1) not null,

foreign key (Estado) references Estados(CodigoEstado)
)

go

insert into Personas values('0','','','Administrador','','',default,'V')

go

create table Usuarios(
CodigoUsuario int primary key identity(1,1),
Login varchar(20) not null unique,
Pswd varchar(200) not null,
Persona int not null,
Rol int not null,
FechaCreacion datetime default getdate() not null,
Estado char(1) not null,

foreign key (Persona) references Personas(CodigoPersona),
foreign key (Rol) references Roles(CodigoRol),
foreign key (Estado) references Estados(CodigoEstado)
)

go

insert into Usuarios values('Admin','$2b$10$VNdO8DY7q8K85kaRD8ErmOjhDvWvof8/5zCdxY/Zc2YRxGcXoZvva',1,1,default,'V')

go

create table TiposHabitacion
(
  CodigoTipoHabitacion int primary key identity (1,1),
  Descripcion Varchar(200) not null,
  FechaCreacion datetime default getdate() not null,
  Estado char(1) not null,
  Usuario int not null,

  foreign key (Estado) references Estados(CodigoEstado),
  foreign key (Usuario) references Usuarios(CodigoUsuario)
)

go

create table FormasCobro
(
  CodigoFormaCobro int primary key identity (1,1),
  Descripcion Varchar(200) not null,
  FechaCreacion datetime default getdate() not null,
  Estado char(1) not null,
  Usuario int not null,

  foreign key (Estado) references Estados(CodigoEstado),
  foreign key (Usuario) references Usuarios(CodigoUsuario)
)

go

insert into FormasCobro values('Habitacion',default,'V',1)
insert into FormasCobro values('Cama',default,'V',1)
insert into FormasCobro values('Mixto',default,'V',1)

go

create table Habitaciones(
  CodigoHabitacion int primary key identity(1,1),
  TipoHabitacion int not null,
  Descripcion varchar(200) not null,
  WebRef  varchar(20),
  FormaCobro int not null,
  Estado char(1) not null,
  FechaCreacion datetime default getdate() not null,
  Usuario int not null,

  foreign key (TipoHabitacion) references TiposHabitacion(CodigoTipoHabitacion),
  foreign key (FormaCobro) references FormasCobro(CodigoFormaCobro),
  foreign key (Estado) references Estados(CodigoEstado),
  foreign key (Usuario) references Usuarios(CodigoUsuario)
)


GO

create table Camas(
CodigoCama int primary key identity(1,1),
Descripcion varchar(200) not null,
Precio float not null,
Habitacion int not null,
Estado char(1) not null,
FechaCreacion datetime default getdate() not null,
Usuario int not null,

foreign key (Habitacion) references Habitaciones(CodigoHabitacion),
foreign key (Estado) references Estados(CodigoEstado),
foreign key (Usuario) references Usuarios(CodigoUsuario)
)

GO

create table CategoriasProductos
(
  CodigoCategoria int primary key identity (1,1),
  Descripcion Varchar(200) not null,
  FechaCreacion datetime default getdate() not null,
  Estado char(1) not null,
  Usuario int not null,

  foreign key (Estado) references Estados(CodigoEstado),
  foreign key (Usuario) references Usuarios(CodigoUsuario)
)

GO

create table Productos(
  CodigoProducto int primary key identity(1,1),
  Categoria int not null,
  Nombre varchar(100) not null,
  Descripcion varchar(200) not null,
  PrecioCompra Decimal(6,2) not null,
  PrecioVenta Decimal(6,2) not null,
  FechaCreacion datetime default getdate() not null,
  Estado char(1) not null,
  Usuario int not null,

  foreign key (Categoria) references CategoriasProductos(CodigoCategoria),
  foreign key (Estado) references Estados(CodigoEstado),
  foreign key (Usuario) references Usuarios(CodigoUsuario)  
)

GO

create table Servicios(
  CodigoServicio int primary key identity(1,1),
  Nombre varchar(100) not null,
  Descripcion varchar(200) not null,
  Medida varchar(50) not null,
  PrecioUnitario Decimal(6,2) not null,
  FechaCreacion datetime default getdate() not null,
  Estado char(1) not null,
  Usuario int not null,

  foreign key (Estado) references Estados(CodigoEstado),
  foreign key (Usuario) references Usuarios(CodigoUsuario)  
)

GO

create table Reservas(
CodigoReserva int primary key identity(1,1),
Persona int not null,
Cama int not null,
LugarProcedencia varchar(200) not null,
RefWeb varchar(200),
FechaInicio datetime,
FechaFin datetime,
Estado char(1) not null,
FechaCreacion datetime default getdate() not null,
Usuario int not null,

foreign key (Persona) references Personas(CodigoPersona),
foreign key (Cama) references Camas(CodigoCama),
foreign key (Estado) references Estados(CodigoEstado),
foreign key (Usuario) references Usuarios(CodigoUsuario)
)

GO





