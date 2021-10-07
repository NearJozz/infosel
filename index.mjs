import enviroment_conf from './enviroment_conf.js';
import mongoConnector from './services/mongodb_connector.js';
import DB_fn from './services/dbFn.js';
import Routes from './infosel_app/router.js'
import express from 'express'
import bodyParser from 'body-parser';

import swaggerUi from 'swagger-ui-express'
import swaggerDocument from './swagger.json'


const app = express()
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

/* ZONA DE INTEGRACION Y SEGEMENTACION DE RUTAS*/
app.use('/api',Routes);
/* ZONA de INTEGRACION DE RUTA PARA DOCUMENTACION*/
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

async function main(){
  console.log("********************************************");
  console.log("Aplicacion Reto Infosel");
  console.log("Desarrollador : Ing. Josue Martinez Mondragon");
  console.log("E-mail : jozz.mm99@gmail.com");
  console.log('::: "Dadme un punto de apoyo y movere al mundo":::');
  console.log("::: Arquímides de Siracusa :::");
  console.log("********************************************");
  console.log();
  let {DB_ADDRESS, DB_PORT,DB,HTTP_PORT} =global.app.env;
  console.log(DB_ADDRESS, DB_PORT,DB,HTTP_PORT);
  let dbClient = await mongoConnector({DB_ADDRESS:DB_ADDRESS,DB_PORT:DB_PORT,DB:DB})
  global.app.dbFn=new DB_fn(dbClient);
  app.listen(HTTP_PORT,()=>{
    console.log("**********************");
    console.log("HTTP Server Online!!!");
    console.log("**********************");
  })
}

main()
