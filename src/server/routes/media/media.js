var express = require('express');
var query = require('../pg');
var path = require('path');
var fs = require('fs');
var multer = require('multer');
var audioupload = multer({dest:'mediauploads/'});
var rnum = require('../random');
var router = express.Router();

/**媒体文件存储（图片，音频，视频） */
router.post('/',audioupload.single('file'), async (req, res) => { 
    console.log('媒体文件',req.body);
    console.log(req.file);
    fs.readFile(req.file.path,async (err,data)=>{
      if(err){return res.send('上传失败')} 
      let time=Date.now()+parseInt(Math.random()*999)+parseInt(Math.random()*2222);
      let extname=req.file.mimetype.split('/')[1];
      let keepname=time+'.'+extname;  
      fs.writeFile(path.join(__dirname,'file/'+keepname),data,(err)=>{
        if(err){
          console.log('写入失败');
          return res.send('写入失败')
        }
        console.log('写入成功');
      });
    
      console.log(keepname);
      var audiosrc = keepname;
      var url = 'http://xpmxia.cn.utools.club/getmediafile/'+keepname;  //http://xpmxia.cn.utools.club  

      let obj = {
        success:true,
        data:url
      }
      console.log(obj);
      res.send(obj);

    //   var figure = await query('SELECT id FROM audio',[]);
    //   var uid = figure.length+1;
    //   var obj = await query('INSERT INTO audio(id,src) VALUES ($1,$2)',[uid,audiosrc]);
      

     
    });
});
  



module.exports = router;
