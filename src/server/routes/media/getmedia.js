var express = require('express');
var query = require('../pg');
var path = require('path');
var fs = require('fs');
var router = express.Router();


/**获取音频 */
router.get('/', async (req, res) => {
    var src;
    var figure = await query('SELECT src FROM audio',[]);
    if(figure.length != 0){
      console.log(figure[figure.length-1].src+'读取');
      src=figure[figure.length-1].src;
      var s = 'file/'+ src;
      audiosrc = path.join(__dirname,s);
      fs.readFile(audiosrc,function(err,filedata){
        if(err){
          console.log(err);
          return;
        }else{
          res.write(filedata);
          res.end();
        }
      });
    }
});
  



module.exports = router;
