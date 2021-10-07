# infosel
infosel tech test

Aplicacion reto para Infosel (Back-end)

La Aplicacion consta de servicio API, documentación, set de pruebas y configuracion para Docker.
Empecemos!

Pre-requisitos:
1. Clonar el proyecto a tu local.
2. En la raiz del proyecto agregar un archivo .env
  con las siguientes claves, los valores son ejemplos.

  ( Ejecución sin Docker )
  --------------------------------
    DB_ADDRESS = 127.0.0.1
    DB_PORT = 27017
    DB = test
    HTTP_PORT = 8080
    SECRETMASTERKEY=s3cr3t0
    JWT_EXPIRE = 2h
  -------------------------------
  ( Ejecución con Docker )
  --------------------------------
    DB_ADDRESS = <Servicio de mongodb>
    DB_PORT = 27017
    DB = test
    HTTP_PORT = 8080
    SECRETMASTERKEY=s3cr3t0
    JWT_EXPIRE = 2h
    -------------------------------

  Es posible cambiar estos valores a tu conveniencia.

  Para ser practicos, se require dejar el archivo .env aun que se realice la "Dockerizacion" del proyecto;
  esto para no requerir estar cambiando el archivo de Dockerfile.

  Instalacion de dependecias:
  $  npm install

  Ejecutar Aplicacion:
  $ npm run dev

  Ejecutar en forma de debuggeo:
  $ npm run debug

  Ejecutar set de pruebas
  $ npm run test

Cualquier duda o comentario, siempre seran bien aceptados. Sientete libre de escribirme a mi correo.
--------------------------------
  >Wake up Neo
  >The Matrix has you...
  >Follow the white rabbit...
  >Knock Knock Neo.
-------------------------------
