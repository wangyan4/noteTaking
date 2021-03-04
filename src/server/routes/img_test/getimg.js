var express = require('express');
var query = require('../pg');
var path = require('path');
var fs = require('fs');
var router = express.Router();

/**获取图片 */
router.get('/',async (req,res) => {
    var userimg;
    var figure = await query('SELECT userimg FROM img',[]);

    if(figure.length != 0){
      console.log(figure[figure.length-1].userimg+'读取');
      userimg = path.join(__dirname,figure[figure.length-1].userimg);
    
      fs.readFile(userimg,'binary',function(err,filedata){
        if(err){
          console.log(err);
          return;
        }else{
          res.write(filedata,'binary');
          res.end();
        }
      });
    }
  
    
  
});
  



module.exports = router;
