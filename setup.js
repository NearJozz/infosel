import enviroment_conf from './enviroment_conf.js';
import mongoConnector from './services/mongodb_connector.js';

async function setup(){
  try{
    let {DB_ADDRESS, DB_PORT,DB,HTTP_PORT} =global.app.env;
    let dbClient = await mongoConnector({DB_ADDRESS:DB_ADDRESS,DB_PORT:DB_PORT,DB:DB})
    console.log(
      `Se van a crear las colecciones necesarias para la Aplicacion en DB : ${DB}
      collection.users,collection.movimientos,collection.catalogos
      collection.users : Define algunos campos indices unicos
      [ RFC , auth.nombreUsuario ]
      `
    );
    dbClient.collection('users').createIndex({'RFC':'text','auth.nombreUsuario':'text'},{unique:true},(err,res)=>{
      if(err){
        console.log("Ocurrio algun Error al crear los indices en coleccion 'users' ");
        console.log(`${err.toString()}`);
        process.exit()
      }else{
        console.log("Se crearon correctamente los indices para 'users' ");
        console.log("coleccion movimientos, se creara a partir de que se guarde algun movimiento en su DB");
        console.log("Se creara una coleccion catalogos, para Cat.productos, Cat.tipoCuenta");
        let catalogos=[
          {cat:'productos',items:['Debito','Credito','Chequera']  },
          {cat:'operaciones',items:['TEF','SPEI']  }
        ]
        dbClient.collection('catalogos').insertMany(catalogos,(err,res)=>{
          if(err){
            console.log("Ocurrio algun error al insertar los catalogos");
            console.log(`${err.toString()}`);
            process.exit()
          }else{
            console.log("***************************")
            console.log("Setup Listo!!!!");
            console.log("***************************")
            process.exit()
          }
        })
      }
    })
  }
  catch(Ex){
    console.log(Ex.message);
  }
}
setup();
