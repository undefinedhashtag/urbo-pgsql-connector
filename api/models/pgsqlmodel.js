// var dbconfig = {
//     database : process.env.POSTGRES_DB || 'db',
//     user : process.env.POSTGRES_USER || null,
//     password : process.env.POSTGRES_PASSWORD || null,
//     host :  process.env.POSTGRES_HOST || 'localhost',
//     port :  process.env.POSTGRES_PORT || 5432
// };

var log = require('log4js').getLogger();
log.setLevel(process.env.LOG_LEVEL || 'INFO');

var pg = require('pg');

function PGSQLModel(cfg){
  this._cfg = cfg;
  this._squel = require('squel');
};

// 'energy',
// data:{field: 'value'}
PGSQLModel.prototype.insert = function(table,data,cb){
  if (!data || (data.isArray && data.length==0)){
    log.warning('Trying to insert data with no data. Ignoring.')
    return;
  } 

  var sql = this._squel.insert().into(table).setFieldsRows(data).toString();
  
  this._connect(function(err,client,done){
    client.query(sql,function(err,r){
      done();
      if (err){
        console.log(err);
        log.error('Error when inserting data');
        log.error(err);
      }
      if (cb) cb(err,r);
    });
  }); 
}

PGSQLModel.prototype._connect = function(cb){
  pg.connect(this._cfg,cb);
}

PGSQLModel.prototype.query = function(sql,bindings,cb){
  this._connect(function(err,client,done){
    if (err){
      console.log(err);
      return;
    }
    client.query(sql,bindings,function(err,r){
      done();
      if (err){
        log.error('Error executing query');
        log.error(err);
      }
      if (cb) cb(err,r);
    });
  });
}

module.exports = PGSQLModel;