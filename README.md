# Taxi24 



## Descripción

 Taxi24 es una nueva startup que quiere revolucionar la industria del transporte proporcionando unasolución de marca blanca existentes.

## Requerimientos
 Para utilizar este proyecto es necesario tener instalado en su dispositivo o entorno: 
- `nodeJs`
- `Nestjs`
- `PostgreSQL`

## Instalación
 ### Base de datos

Lo primero que hay que hacer es crear la base de datos que utilizaremos para la API, puede hacerlo desde la GUI de su manejador de base de datos o corriendo este script.

```bash
CREATE DATABASE taxi24
```
**Nota:** Se recomienda utilizar el nombre taxi24, pero puede usar otro nombre teniendo en cuenta que debe ser colocado en su archivo `.env`.

### Proyecto

Luego de haber clonado el proyecto es necesario crear un archivo `.env` en la ruta raiz de nuestro proyecto con las siguientes variables:

```bash
DATABASE_HOST
DATABASE_PORT
DATABASE_PASSWORD
DATABASE_USERNAME
DATABASE_NAME
```
**Nota:** El valor de la variable `DATABASE_NAME` debe ser el mismo de la base de datos creada anteriormente.

Un ejemplo de este archivo seria:

```bash
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_PASSWORD=test_password
DATABASE_USERNAME=test_username
DATABASE_NAME=taxi24
```

Una vez creado el archivo `.env` es necesario ejecutar el siguiente comando desde la ruta del proyecto para obtener todas las dependencias del proyecto:

```bash
$  npm install           
```

Luego de instalar todas las dependencias es necesario ejecutar el siguiente comando desde la ruta del proyecto para crear las tablas en la base de datos:

```bash
$  npm run migration:run            
```

Despues de haber creado las tablas en la base de datos es necesario ejecutar el siguiente comando desde la ruta del proyecto para crear archivos iniciales en las tablas:

```bash
$  npm run seed:run             
```

## Ejecución

Para inicializar el proyecto es necesario ejecutar el siguiente comando:

```bash
$ npm run start
```

## Test
Para ejecutar las pruebas del proyecto ejecute el siguiente comando:

```bash
# unit tests
$ npm run test
```


Creador por Pedro Shanlatte.
