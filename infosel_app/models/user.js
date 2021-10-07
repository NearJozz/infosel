
function User(user=null){
  this.getID=function(){
    return this._id;
  }
  this.nuevoUsuario=function(user){
      let {nombres,apellidos,RFC}= user;
      this.nombres=nombres
      this.apellidos=apellidos
      this.telefono=(user.telefono)?user.telefono.replace(/ /g,''):'';
      this.RFC=RFC;
      this.direccion=(user.direccion)?user.direccion:'';
      this.productos=[]
      this.cuentas=[]
  }
  this.editarUsuario= function(user){
      let {telefono,direccion} = user;
      this.telefono=(telefono)?telefono.replace(/ /g,''):this.telefono;
      this.direccion=(direccion)?direccion:this.direccion;
  }
  this.setAuth=function(auth){
    let {nombreUsuario, password}=auth;
    this.auth={}
    this.auth.nombreUsuario=nombreUsuario;
    this.auth.password=password;
    this.auth.token=null
    this.auth.inicioSesion=null;
    this.auth.estatus=1;
  }
  this.verificarCredenciales=function(auth){
    if(this.auth!=undefined){
      return (this.auth.nombreUsuario==auth.nombreUsuario && this.auth.password==auth.password)
    }else{
      return false;
    }
  }
  this.iniciarSesion=function(token){
    this.auth.token=token;
    this.auth.inicioSesion=new Date().getTime();
  }
  this.agregarCuenta=function(cuenta){
    let {numeroCuenta,producto,saldo,nip} = cuenta;
    let productoExiste=this.productos.find((d)=>{
      if(d==producto){
        return d;
      }
    })
    if(!productoExiste){
      this.productos.push(producto)
    }
    this.cuentas.push({numeroCuenta:numeroCuenta,producto:producto,saldo:saldo,nip:nip,estatus:1})
  }
  this.tieneCuenta=function(numeroCuenta){
    let has=this.cuentas.find((d)=>{
      if(d.numeroCuenta==numeroCuenta){
        return d;
      }
    })
    return (has!=undefined)
  }
  this.verificarOrigen=function(token,jwtReversa){
    if(this.auth!=undefined){
      if(this.auth.token==token && this.auth.nombreUsuario==jwtReversa.nombreUsuario){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  }
  this.verificarToken=function(token){
    return (this.auth.token==token)
  }
  this.abonoCuenta=function(cuentaMov,monto){
    let flag=false;
    this.cuentas.map((cuenta)=>{
      if(cuenta.numeroCuenta==cuentaMov){
        cuenta.saldo+=monto;
        flag=true;
      }
    })
    return flag;
  }
  this.cargoCuenta=function(cuentaMov,monto){
    let flag=false;
    this.cuentas.map((cuenta)=>{
      if(cuenta.numeroCuenta==cuentaMov){
      console.log((cuenta.numeroCuenta==cuentaMov));
        let tmp=cuenta.saldo-monto
        console.log(tmp);
        if(!(tmp<0)){
          cuenta.saldo-=monto;
          flag=true;
        }
      }
    })
    return flag;
  }
  this.getSaldo=function(){
    if(this.cuentas.length>0){
      return this.cuentas;
    }else{
      return [];
    }
  }
  this.getStatusUser=function(){
    if(this.auth.estatus==1){
      return true;
    }else{
      return false;
    }
  }
  this.setStatusUser=function(estatus){
    this.auth.estatus=estatus;
  }
  this.getPublicData=function(){
    return {nombres:this.nombres,apellidos:this.apellidos,telefono:this.telefono,RFC:this.RFC,direccion:this.direccion,productos:this.productos}
  }
  this.getPublicInfoToken=function(){
    return {_id:this._id,nombreUsuario:this.auth.nombreUsuario}
  }
  this.getPerfilInfoPrivado=function(){
    let nOut={...this}
    delete nOut.auth;
    return nOut;
  }
  if(user!=null){
    this.nuevoUsuario(user);
  }
}

export {User};
