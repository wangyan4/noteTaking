var express = require('express');
var query = require('../pg');
var path = require('path');
var fs = require('fs');
var multer = require('multer');
var audioupload = multer({dest:'audiouploads/'});
var rnum = require('../random');
var router = express.Router();

/**音频存储 */
router.post('/',audioupload.single('audiofile'), async (req, res) => { //audionote/:nid
    console.log('录音存储',req.body);
    console.log(req.file);
    fs.readFile(req.file.path,async (err,data)=>{
      if(err){return res.send('录音上传失败')} 
      let time=rnum;
      let extname=req.file.mimetype.split('/')[1];
      let keepname=time+'.'+extname;  
      fs.writeFile(path.join(__dirname,'audiofile/'+keepname),data,(err)=>{
        if(err){
          console.log('写入失败');
          return res.send('写入失败')
        }
        console.log('录音写入成功');
      });
    
      console.log(keepname);
      var audiosrc = keepname;

      var figure = await query('SELECT id FROM audio',[]);
      var uid = figure.length+1;
      var obj = await query('INSERT INTO audio(id,src) VALUES ($1,$2)',[uid,audiosrc]);
      res.send('ok');

     
    });
});
  



module.exports = router;
