import {User} from './models/user.js';
import {Movimiento} from './models/movimiento.js';
class managerAccount{
  crearNumeroCuenta(){
    return new Date().getTime().toString();
  }
  crearNip(){
    return Math.floor(Math.random()*1000)
  }
  async findUserById(id){
    try{
      let user = await global.app.dbFn.findOne('users',{_id:id})
      if(user!=null){
        User.call(user);
        return user
      }else{
        return null;
      }
    }catch(Ex){
        throw Ex;
    }
  }
  async findUserByRFC(RFC){
    try {
      let user = await global.app.dbFn.findOne('users',{RFC:RFC})
      if(user!=null){
        User.call(user);
        return user;
      }else{
        return null;
      }
    } catch (e) {
        throw Ex;
    }
  }
  async findUserByNombreUsuario(nombreUsuario){
    try {
      let user = await global.app.dbFn.findOne('users',{'auth.nombreUsuario':nombreUsuario})
      if(user!=null){
        User.call(user);
        return user;
      }else{
        return null;
      }
    } catch (e) {
        throw Ex;
    }
  }
  async findUserByNumeroCuenta(numeroCuenta){
    try {
      let user = await global.app.dbFn.findOne('users',{"cuentas.numeroCuenta":numeroCuenta})
      if(user!=null){
        User.call(user);
        return user;
      }else{
        return null;
      }
    } catch (e) {
        throw Ex;
    }
  }
  async getUserCuentas(user){
    try{
      let userCuentas=await this.findUserById(new global.app.dbFn.ObjectID(user._id))
      let cuentas = userCuentas.getSaldo();
      return cuentas;
    }catch(Ex){
      throw Ex
    }
  }
  async updateUser(user){
    try{
      let dbRes = await global.app.dbFn.update('users',{_id:user._id},user)
      return dbRes;
    }catch(Ex){
        throw Ex;
    }
  }
  async registrarUsuario(user){
    try {
      let userExist = await this.findUserByRFC(user.RFC);
      if(!userExist){
          let userByNombreUsuario= await this.findUserByNombreUsuario(user.nombreUsuario)
          if(userByNombreUsuario){
            throw {_code:400,message:"El nombre usuario no esta disponible" };
          }
          let nuevoUsuario=new User(user);
          nuevoUsuario.setAuth(user);
          user.numeroCuenta=this.crearNumeroCuenta();
          user.nip=this.crearNip();
          nuevoUsuario.agregarCuenta(user);
          let dbRes=await global.app.dbFn.insert('users',nuevoUsuario)
          return nuevoUsuario.getPublicData();

      }else{
        throw {_code:400,message:"RFC Invalido o ya existente"}
      }
    } catch (Ex) {
      throw Ex;
    }
  }
  async editarUsuario(input){
    try {
      if(input.user.verificarOrigen(input.jwtReversa.token,input.jwtReversa)){
        input.user.editarUsuario(input)
        await this.updateUser(input.user)
        return input.user.getPerfilInfoPrivado();
      }else{
        throw {_code:401,message:"Operacion no permitida" };
      }
    } catch (Ex) {
        throw Ex;
    }
  }
  async perfilUsuario(profile){
    try {
      if(profile.user.verificarToken(profile.jwtReversa.token)){
          return profile.user.getPerfilInfoPrivado();
      }else{
        throw {_code:401,message:"Operacion no permitida" };
      }
    } catch (Ex) {
        throw Ex;
    }
  }
  async bajaLogicaUsuario(baja){
    try{
      if(baja.user.verificarToken(baja.jwtReversa.token)){
        baja.user.setStatusUser(0);
        await this.updateUser(baja.user)
        return {estatus:baja.user.getStatusUser()}
      }else{
        throw {_code:401,message:"Operacion no permitida" };
      }
    }catch(Ex){
      throw Ex;
    }
  }
  async nuevoCargo(payload){
    try{
      let userOrigenAuth = payload.user;
      let userOrigen = await this.findUserByNumeroCuenta(payload.cuentaOrigen)
      let userDestino = await this.findUserByNumeroCuenta(payload.cuentaDestino)
      if(userOrigen.getID().toString()===userOrigenAuth.getID().toString()){
        if(userOrigen.verificarOrigen(payload.jwtReversa.token,payload.jwtReversa)){
          if(!userOrigen.getStatusUser()){
            throw {_code:403,message:"Usuario desactivado" };
          }
        if(userOrigen.tieneCuenta(payload.cuentaOrigen)){
          let movimiento = new Movimiento(payload);
          // let userDestino = await this.findUserByNumeroCuenta(payload.cuentaDestino)
          if(userDestino){
            let saldoDestino = userDestino.cargoCuenta(movimiento.cuentaDestino,movimiento.monto);
            if(saldoDestino){
              let saldoOrigen = userOrigen.abonoCuenta(movimiento.cuentaOrigen,movimiento.monto)
              if(saldoOrigen){
                movimiento.setStatus("aprobado")
                let guardadoSeguro1=await this.updateUser(userDestino)
                let guardadoSeguro2=await this.updateUser(userOrigen)
                let dbRes=await global.app.dbFn.insert('movimientos',movimiento)
                return movimiento;
              }else{
                movimiento.setStatus("error")
                let dbRes=await global.app.dbFn.insert('movimientos',movimiento)
                throw {_code:400,message:"Numero de Cuenta invalido"}
              }
            }else{
              movimiento.setStatus("rechazado")
              let dbRes=await global.app.dbFn.insert('movimientos',movimiento)
              throw {_code:403,message:"Saldo Insuficiente" };
            }
          }else{
            movimiento.setStatus("pendiente")
            let dbRes=await global.app.dbFn.insert('movimientos',movimiento)
            return movimiento;
          }
        }else{
          throw {_code:403,message:"Operacion no permitida" };
        }
        }else{
        throw {_code:403,message:"Operacion no permitida" };
      }
    }else{
      throw {_code:403,message:"Operacion no permitida" };
    }
    }catch(Ex){
      throw Ex
    }
  }
  async nuevoAbono(payload){
    try{
      let userOrigenAuth = payload.user;
      let userOrigen = await this.findUserByNumeroCuenta(payload.cuentaOrigen)
      let userDestino = await this.findUserByNumeroCuenta(payload.cuentaDestino)
      if(userOrigen.getID().toString()===userOrigenAuth.getID().toString()){
        if(!userOrigen.getStatusUser()){
          throw {_code:403,message:"Usuario desactivado" };
        }
        if(userOrigen.verificarOrigen(payload.jwtReversa.token,payload.jwtReversa)){
        if(userOrigen.tieneCuenta(payload.cuentaOrigen)){
          let movimiento = new Movimiento(payload);
          // let userDestino = await this.findUserByNumeroCuenta(payload.cuentaDestino)
          if(userDestino){
            let saldoDestino = userDestino.abonoCuenta(movimiento.cuentaDestino,movimiento.monto);
            if(saldoDestino){
              let saldoOrigen = userOrigen.cargoCuenta(movimiento.cuentaOrigen,movimiento.monto)
              if(saldoOrigen){
                movimiento.setStatus("aprobado")
                let guardadoSeguro1=await this.updateUser(userDestino)
                let guardadoSeguro2=await this.updateUser(userOrigen)
                let dbRes=await global.app.dbFn.insert('movimientos',movimiento)
                return movimiento;
              }else{
                movimiento.setStatus("error")
                let dbRes=await global.app.dbFn.insert('movimientos',movimiento)
                throw {_code:400,message:"Numero de Cuenta invalido"}
              }
            }else{
              movimiento.setStatus("rechazado")
              let dbRes=await global.app.dbFn.insert('movimientos',movimiento)
              throw {_code:403,message:"Saldo Insuficiente" };
            }
          }else{
            movimiento.setStatus("pendiente")
            let dbRes=await global.app.dbFn.insert('movimientos',movimiento)
            return movimiento;
          }
        }else{
          throw {_code:403,message:"Operacion no permitida" };
        }
        }else{
        throw {_code:403,message:"Operacion no permitida" };
      }
    }else{
      throw {_code:403,message:"Operacion no permitida" };
    }
    }catch(Ex){
      throw Ex
    }
  }
  async login(auth,fnAuth){
    try {
      let userExist= await this.findUserByNombreUsuario(auth.nombreUsuario)
      if(userExist){
        let flag=userExist.verificarCredenciales(auth)
        if(flag){
          let token=fnAuth(userExist.getPublicInfoToken())
          userExist.iniciarSesion(token);
          await this.updateUser(userExist)
          return token;
        }else{
          throw {_code:401,message:"Credenciales invalidas"}
        }
      }else{
        throw {_code:401,message:"Credenciales invalidas"}
      }
    } catch (Ex) {
      throw Ex;
    }
  }
}
export default new managerAccount();
