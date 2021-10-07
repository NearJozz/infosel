import dotenv from 'dotenv';
async function conf(){
  dotenv.config();
  global.app={};
  global.app.env=process.env;
  global.app.name="infosel tech test";
  global.app.version="1.0.0";
  global.app.dbFn=null;
}

export default conf();
