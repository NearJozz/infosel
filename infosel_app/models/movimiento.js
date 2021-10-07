function Movimiento(payload=null){
  this.nuevoMovimiento=function(move){
    this.usuario=move.usuario;
    this.cuentaOrigen=move.cuentaOrigen;
    this.cuentaDestino=move.cuentaDestino;
    this.monto=move.monto;
    this.tipoMovimiento=move.tipoMovimiento;
    this.concepto=(move.concepto)?move.concepto:"";
    this.referencia=(move.referencia)?move.referencia:"";
    this.operacion=move.operacion;
    this.fechaAplicacion=new Date().getTime();
    this.status="pendiente";
  }
  this.setStatus=function(status){
    this.status=status;
  }
  if(payload){
    this.nuevoMovimiento(payload)
  }
}
export {Movimiento};
