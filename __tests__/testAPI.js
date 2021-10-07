
import enviroment_conf from './../enviroment_conf.js'
import request from 'supertest'
import app from './../infosel_app/router.js'
import mongoConnector from './../services/mongodb_connector.js'
import DB_fn from './../services/dbFn.js';
import express from 'express'
import bodyParser from 'body-parser';
const AppTest = express()
AppTest.use(bodyParser.urlencoded({
  extended: true
}));
AppTest.use(bodyParser.json());

/* ZONA DE INTEGRACION Y SEGEMENTACION DE RUTAS*/
AppTest.use('/',app);


let {DB_ADDRESS, DB_PORT,DB,HTTP_PORT} =global.app.env;
let dbClient = await mongoConnector({DB_ADDRESS:DB_ADDRESS,DB_PORT:DB_PORT,DB:DB})
global.app.dbFn=new DB_fn(dbClient);
//global.app.dbFn= new dbFn;





  describe("Test API: Prueba de RouterAPI InfoselApp", () => {
    let UserPruebas=null;
    let TokenPruebas=null
    test("Prueba de conectividad a MongoDB",async()=>{
        let dbResp = await global.app.dbFn.findOne('users',{})
        expect(dbResp).toEqual(expect.anything());
        UserPruebas=dbResp;
    })
    test("Prueba API: Registro de Usuario con la Informacion minima ( POST /registrarUsuario )",async()=>{
        request(AppTest)
          .post("/registrarUsuario")
          .expect("Content-Type", /json/)
          .send({
            nombres:"UsuarioTest1",
            apellidos:"Min Tester",
            RFC:"TESTRFC1",
            nombreUsuario:"Tester1",
            password:"1234567"
          })
          .expect(200)

    })
    test("Prueba API: Intento de Registro de Usuario con el mismo RFC que el usuario Test1 ( POST /registrarUsuario )",async()=>{
      const response = await request(AppTest).post("/registrarUsuario").expect("Content-Type", /json/)
      .send({
        nombres:"UsuarioTest1",
        apellidos:"Min Tester",
        RFC:"TESTRFC1",
        nombreUsuario:"Tester1",
        password:"1234567"
      })
      expect(response.statusCode).toBe(400);
    })
    test("Prueba API: Prueba de Login para usuario Test1 y obtener un Token JWT ( POST /login )",async()=>{
      const response = await request(AppTest).post("/login").expect("Content-Type", /json/)
      .send({
        nombreUsuario:UserPruebas.auth.nombreUsuario,
        password:UserPruebas.auth.password
      })
      expect(response.statusCode).toBe(200)
      expect(response.body.token).not.toBeUndefined()
      TokenPruebas=response.body.token;
    })
    test("Prueba API: Prueba de Editar Usuario para usuario Test1 usando JWT ( POST /editarUsuario )",async()=>{
      const response = await request(AppTest).post("/editarUsuario").expect("Content-Type", /json/)
      .set("x-access-token",TokenPruebas)
      .send({
        telefono:"111111111",
        direccion:"Prueba de Cambio de direccion"
      })
      expect(response.statusCode).toBe(200)



    })
    
  });
