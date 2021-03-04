var express = require('express');
var pgdb = require('../pg');
var router = express.Router();


/**
 * 获取某个笔记仓库详细内容
 */
router.get('/', function(req, res) {
    var id = req.params.id;
    console.log('id',id);
    pgdb.connect(function(isErr,client,done){
        if(isErr){
          console.log('数据库连接出错');
          return;
        }
        client.query('SELECT title,description,content,time FROM note where uid=$1',['1'],function(isErr,rst){
          done();
          if(isErr){
            console.log('查询出错',isErr);
          }else{
            let obj = {
              status:0,
              data:rst.rows
            }
            console.log(obj);
            res.send(obj);
            
          }
        });
      
        
    });
});
  



module.exports = router;
