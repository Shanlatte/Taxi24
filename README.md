# Taxi24 
Code challenge para Taxi24. 

Taxi24 es una nueva startup que quiere revolucionar la industria del transporte proporcionando una solución de marca blanca.
## Descripción General
El proyecto consta de 6 entidades:
- Pasajero - Passenger
- Conductor - Driver
- Viaje - Ride
- Factura - Invoice
- Ubicación - Location
- Persona - Person

## Endpoints
### Pasajero
- `GET /passengers`, obtiene todos los pasajeros. `*`
- `GET /passengers/:id`, obtiene el pasajero encontrado. Recibe el id como parámetro. `*`
- `POST /passengers`, crea un pasajero. Recibe como cuerpo: name y email.

### Conductor
- `GET /drivers`, obtiene todos los conductores. `*`
- `GET /drivers/available`, obtiene todos los conductores disponibles. `*`
- `GET /drivers/available3km/:latitude/:longitude`, obtiene una lista de todos los conductores disponibles en un radio de 3km para una ubicación en específico. Recibe como parámetro: latitude y longitude. `*`
- `GET /drivers/find3NearestDrivers/:latitude/:longitude`, obtiene una lista de los 3 conductores mas cercanos para una ubicación en específico. Recibe como parámetro: latitude y longitude. *
- `GET /drivers/:id`, obtiene el conductor encontrado. Recibe el id como parámetro. `*`
- `POST /drivers`, crea un conductor. Recibe como cuerpo: name, email, latitude, longitude, available.

### Viaje
- `POST /rides`, crea un viaje. Recibe como cuerpo: idDriver, idPassenger, startLatitude, startLongitude, endLatitude y endLongitude. `*`
- `PATCH /rides/complete`, coloca el estado del viaje como finalizado. Recibe como parámetro: id. `*`
- `GET /rides/active`, obtiene todos los viajes activos. `*`
- `GET /rides`, obtiene todos los viajes.
- `GET /rides/:id`, obtiene el viaje encontrado. Recibe el id como parámetro.

### Factura
- `GET /invoices`, obtiene todas las facturas.
- `GET /invoices/:id`, obtiene la factura encontrada. Recibe el id como parámetro.

### Persona
- `POST /persons`, crea una persona. Recibe como parámetro: name y email.

### Ubicación 
- `GET /locations`, obtiene la ubicación encontrada. Recibe el id como parámetro.

**Nota**: Los endpoints marcados con `*` eran requeridos por el **code challenge**.

## Requerimientos
 Para utilizar este proyecto es necesario tener instalado en su dispositivo o entorno: 
- `nodeJs`
- `Nestjs`
- `PostgreSQL`

## Instalación
 ### Base de datos

El primer paso es crear la base de datos que utilizaremos para la API, puede hacerlo desde la aplicación gráfica manejadora de base de datos o corriendo este script.

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

Un ejemplo de este archivo:

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
# pruebas unitarias
$ npm run test
```


## Extra
Para la funcionalidad de encontrar conductores teniendo referencias las latidudes y longitudes a un punto en específico se utiliza la fórmula [Haversine](https://barcelonageeks.com/formula-de-haversine-para-encontrar-la-distancia-entre-dos-puntos-en-una-esfera/).

*Nota: Los valores de las ubicaciones de los conductores fueron creados alrededor de estos valores de latitud y longitud, para una mejor experiencia utilizar estos valores en los endpoints necesarios:
- `latitude`: 18.444433
- `longitude`: -69.959997


Creado por Pedro Shanlatte.
