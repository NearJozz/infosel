
import express from 'express'
import {validate} from 'node-model-validation'
import manager from './manager.js'
import requests from './request_def.js'
const Router= express.Router();

//Dependencias y variables para genrerar y verificar JWT
//*******
import jwt from "jsonwebtoken";
const {createHmac} = await import('crypto');
const {SECRETMASTERKEY}=process.env
const {JWT_EXPIRE}=process.env
//*******


Router.post('/login',async(req,res)=>{
  try{
    let bypass=validate(req.body,requests.login)
    if(bypass.errors){
      res.status(400).send({message:"parametros obligatorios",errors:bypass.errors})
      return
    }
    let coreRes = await manager.login(bypass.model,createAuthToken)

    res.status(200).send({token:coreRes});
  }catch(Ex){
    if(Ex._code){
      res.status(Ex._code).send({message:Ex.message})
      return
    }else{
      res.status(500).send({message:Ex.message});
      return
    }
  }
})
Router.post('/registrarUsuario',async(req,res)=>{
  try{
    let bypass=validate(req.body,requests.registrarUsuario)
    if(bypass.errors){
      res.status(400).send({message:"parametros obligatorios",errors:bypass.errors})
      return
    }
    let coreRes = await manager.registrarUsuario(bypass.model)
    res.status(200).send({...coreRes});
    return
  }catch(Ex){
    if(Ex._code){
      res.status(Ex._code).send({message:Ex.message})
      return
    }else{
      res.status(500).send({message:Ex.message});
      return
    }
  }
})
Router.post('/editarUsuario',verifyToken,async(req,res)=>{
  try{
    let bypass=validate(req.body,requests.editarUsuario)
    if(bypass.errors){
      res.status(400).send({message:"parametros obligatorios",errors:bypass.errors})
      return
    }
    let coreRes = await manager.editarUsuario(bypass.model)
    res.status(200).send({...coreRes});
    return
  }catch(Ex){
    if(Ex._code){
      res.status(Ex._code).send({message:Ex.message})
      return
    }else{
      res.status(500).send({message:Ex.message});
      return
    }
  }
})
Router.get('/perfilUsuario',verifyToken,async(req,res)=>{
  try{
    let bypass=validate(req.body,requests.perfilUsuario)
    if(bypass.errors){
      res.status(400).send({message:"parametros obligatorios",errors:bypass.errors})
      return
    }
    let coreRes = await manager.perfilUsuario(bypass.model)
    res.status(200).send({...coreRes});
    return
  }catch(Ex){
    if(Ex._code){
      res.status(Ex._code).send({message:Ex.message})
      return
    }else{
      res.status(500).send({message:Ex.message});
      return
    }
  }
})
Router.post('/bajaUsuario',verifyToken,async(req,res)=>{
  try{
    let bypass=validate(req.body,requests.bajaUsuario)
    if(bypass.errors){
      res.status(400).send({message:"parametros obligatorios",errors:bypass.errors})
      return
    }
    let coreRes = await manager.bajaLogicaUsuario(bypass.model)
    res.status(200).send(coreRes);
  }catch(Ex){
    if(Ex._code){
      res.status(Ex._code).send({message:Ex.message})
      return
    }else{
      res.status(500).send({message:Ex.message});
      return
    }
  }
})
Router.post('/abono',verifyToken,async(req,res)=>{
  try{
    let bypass=validate(req.body,requests.nuevoAbono)
    if(bypass.errors){
      res.status(400).send({message:"parametros obligatorios",errors:bypass.errors})
      return
    }
    let coreRes = await manager.nuevoCargo(req.body)
    res.status(200).send(coreRes);
    return
  }catch(Ex){
    if(Ex._code){
      res.status(Ex._code).send({message:Ex.message})
      return
    }else{
      res.status(500).send({message:Ex.message});
      return
    }
  }
})
Router.post('/cargo',verifyToken,async(req,res)=>{
  try{
    let bypass=validate(req.body,requests.nuevoCargo)
    if(bypass.errors){
      res.status(400).send({message:"parametros obligatorios",errors:bypass.errors})
      return
    }
    let coreRes = await manager.nuevoCargo(req.body)
    res.status(200).send(coreRes);
    return
  }catch(Ex){
    if(Ex._code){
      res.status(Ex._code).send({message:Ex.message})
      return
    }else{
      res.status(500).send({message:Ex.message});
      return
    }
  }
})


export default Router;


async function verifyToken (req, res, next) {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
    console.log("token in REQ",token);
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try{
    const hmac = createHmac('sha256', SECRETMASTERKEY);
    let phrase = hmac.digest('hex')
    const decoded = jwt.verify(token, phrase);
    let user = await manager.findUserById(new global.app.dbFn.ObjectID(decoded._id))
    if(!user){
      return res.status(401).send();
    }
    if(!user.verificarToken(token)){
      return res.status(401).send();
    }
    req.body.jwtReversa=decoded;
    req.body.user=user;
    req.body.jwtReversa.token=token;
    return next();
  } catch(Ex){
    if(Ex._code){
      res.status(Ex._code).send({message:Ex.message})
      return
    }else{
      res.status(500).send({message:Ex.message});
      return
    }
  }

};
function createAuthToken(user){
  const hmac = createHmac('sha256', SECRETMASTERKEY);
  let phrase = hmac.digest('hex')
  let validData={...user}
  let token=jwt.sign(
    validData,
    phrase,
    {expiresIn: JWT_EXPIRE}
  )
  return token;
}
