import express from 'express'
import bodyParser from 'body-parser';
const app = express()
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// async function run(conf){
//   try{
//     app.listen(conf.HTTP_PORT, () => {
//       console.log(`server online on port : ${conf.HTTP_PORT}`);
//     })
//     return app;
//   }catch(Ex){
//     throw Ex;
//   }
// }

export default app;
