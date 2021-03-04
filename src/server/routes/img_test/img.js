var express = require('express');
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var upload = multer({dest:'uploads/'});
var query = require('../pg');
var rnum = require('../random');
var router = express.Router();


/**图片存储 */
router.post('/',upload.single('image'),(req,res) => {
    console.log('图片上传');
    console.log(req.file);
    fs.readFile(req.file.path,async (err,data)=>{
        if(err){return res.send('上传失败')} 
        let time=rnum;
        let extname=req.file.mimetype.split('/')[1];
        let keepname=time+'.'+extname;  
        fs.writeFile(path.join(__dirname,'userimg/'+keepname),data,(err)=>{
              if(err){
                console.log('写入失败');
                return res.send('写入失败')
              }
              console.log('写入成功');
        });
          
        console.log(keepname);
        var userimg = 'userimg/'+keepname;

        var figure = await query('SELECT uid FROM img',[]);
        var uid = figure.length+1;
        var obj = await query('INSERT INTO img(uid,userimg) VALUES ($1,$2)',[uid,userimg]);
        res.send('ok');

            
    });
      
  
    
  
});
  



module.exports = router;
