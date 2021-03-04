const pg = require('pg');

var pgdb = new pg.Pool({
    host : '127.0.0.1',
    port : 5432,
    user : 'xiapeimin',
    password : 'xpm2314',
    database : 'bsproject_db'
});


let query = function(sql,values){
    return new Promise((resolve,reject)=>{
        pgdb.connect(function(isErr,client,done){
            if(isErr){
              reject(isErr);
              return;
            }
            client.query(sql,values,function(isErr,rst){
              done();
              if(isErr){
                reject(isErr);
              }else{
                resolve(rst.rows);                
              }
            });         
        });
    });
}

module.exports = query;