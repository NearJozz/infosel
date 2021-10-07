import  MongoClient  from 'mongodb'
const ObjectID = MongoClient.ObjectID;

class DB_fn{
  constructor(Client){
    if(!Client){
      throw new Error("DB_fn constructor must be a DB Client")
    }
    this.Client=Client;
    this.ObjectID=ObjectID;

  }
  insert(col,data){
    return  new Promise((resolve,reject)=>{
      if(data.length!=undefined){
        this.Client.collection(col).insert(data,(err,res)=>{
          if(!err){
            resolve(res);
          }else{
            reject(err);
          }
        })
      }else{
        this.Client.collection(col).insertOne(data,(err,res)=>{
          if(!err){
            resolve(res);
          }else{
            reject(err);
          }
        })
      }

    })
  }
  update(col,query,data){
    return new Promise((resolve,reject)=>{
        this.Client.collection(col).updateOne(query,{$set:{...data}},(err,res)=>{
        if(!err){
          resolve(res.result);
        }else{
          reject(err);
        }
      })
    })
  }
  updateMan(col,query,data){
    return new Promise((resolve,reject)=>{
        this.Client.collection(col).updateMany(query,{...data},(err,res)=>{
        if(!err){
          resolve(res.result);
        }else{
          reject(err);
        }
      })
    })
  }
  remove(col,query){
    return new Promise((resolve,reject)=>{
      this.Client.collection(col).remove(query,(err,res)=>{
        if(!err){
          resolve(res);
        }else{
          reject(err)
        }
      })
    })
  }
  find(col,query,options=null){
    return new Promise((resolve,reject)=>{
      if(options==null){
        this.Client.collection(col).find(query,(err,res)=>{
        if(!err){
          res.toArray((ex,data)=>{
            if(!ex){
              resolve(data);
            }else{
              reject(ex);
            }
          })
        }else{
          reject(err);
        }
      })
    }else{
      this.Client.collection(col).find(query,options,(err,res)=>{
        if(!err){
          res.toArray((ex,data)=>{
            if(!ex){
              resolve(data);
            }else{
              reject(ex);
            }
          })
        }else{
          reject(err);
        }
      })
    }
    })
  }
  findOne(col,query,options=null){
    return new Promise((resolve,reject)=>{
      try{
        if(options==null){
          this.Client.collection(col).findOne(query,(err,res)=>{
            if(!err){
              resolve(res)
            }else{
              reject(err)
            }
        })
        }else{
        this.Client.collection(col).findOne(query,options,(err,res)=>{
          if(!err){
            resolve(res)
          }else{
            reject(err)
          }
        })
      }
    }catch(Ex){
      throw Ex;
    }
    })
  }
  jCreateIndex(ds){
    return new Promise((resolve,reject)=>{
      this.Client.listCollections().toArray(function(err,data){
        if(err){
          reject(err);
         }
         console.log(data);
        for(var i in data){
          if(ds[data[i].name]){
            ds[data[i].name]=true;
          }
        }
        for(var e in ds){
         //console.log(ds[e])
         if(ds[e].has==false){
           var abs={};
           abs[ds[e].k]=ds[e].tp
           if(ds[e].un){
             if(ds[e].un==true){
               var only={"unique":true}
               this.Client.collection(e).createIndex(abs,only,function(err,res){
               if(err) throw err;
               //console.log("Collection",abs );

             })
             }else{
               this.Client.collection(e).createIndex(abs,function(err,res){
               if(err) throw err;
               //console.log("Collection",abs );

             })
             }
             }else{
               console.log(abs);
               this.Client.collection(e).createIndex(abs,function(err,res){
               if(err) throw err;
               //console.log("Collection",abs );

             })
             }
           }
         }
        resolve();
      })
    })
  }
}
function jCreateIndex(ds){
  return new Promise((resolve,reject)=>{
    global.Services.Mongo.listCollections().toArray(function(err,data){
      if(err){
        reject(err);
       }
      for(var i in data){
        if(ds[data[i].name]){
          ds[data[i].name]=true;
        }
      }

      for(var e in ds){
        //console.log(ds[e])
        if(ds[e].has==false){
          var abs={};
          abs[ds[e].k]=ds[e].tp
          global.Services.Mongo.collection(e).createIndex(abs,function(err,res){
          if(err){
              reject(err);
            }
            //console.log("Collection",abs );

          })
        }
      }
      resolve();
    })
  })
}

export default DB_fn
