import { MongoClient } from 'mongodb'
const {ObjectID} = MongoClient;

function buildLink(dbConf){
  // console.log("link",`mongodb://${dbConf.DB_ADDRESS}:${dbConf.DB_PORT}/${dbConf.DB}`)
  return `mongodb://${dbConf.DB_ADDRESS}:${dbConf.DB_PORT}/${dbConf.DB}`
}

async function init(dbConf){
  let Client = new MongoClient(buildLink(dbConf))
  await Client.connect()
  // console.log("MongoDB OK");
  return Client.db(dbConf.DB);
}



export default init;
