var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var fs = require('fs');
var querystring = require('querystring');

var multer = require('multer');
var query = require('./routes/pg');
var rnum = require('./routes/random');
var indexRouter = require('./routes/index');
//var register_user = require('./routes/users/register');
var search_user = require('./routes/users/search');
var img_up = require('./routes/img_test/img');
var img_get = require('./routes/img_test/getimg');
var audio_up = require('./routes/audio_test/audio');
var audio_get = require('./routes/audio_test/getaudio');
var video_up = require('./routes/video_test/video');
var video_get = require('./routes/video_test/getvideo');

var media_up = require('./routes/media/media');
var media_get = require('./routes/media/getmedia');

// var note_content = require('./routes/notes/getnote');
var mynote = require('./routes/notes/usernote');
var share = require('./routes/notes/sharelist');

var read_txt = require('./routes/notes/readtxt');
var write_txt = require('./routes/notes/writetxt');

var app = express();

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

//数据测试

/**
 * 注册 ok
 * */
app.post('/register',(req,res)=>{
  var str = '';
  var flag = false;
  var em_ph,passwd,obj;
  req.on('data',function(data){
    str += data;
  });            
  req.on("end",async ()=> {
    var json = JSON.parse(str);
    em_ph = json.em_ph;
    passwd = json.passwd;
    
    var figure = await query('SELECT em_ph FROM userlist',[]);
    for(var i=0;i<figure.length;i++){
      if(em_ph==figure[i].em_ph){
        obj={
          success:false,
          message:'手机号/邮箱已注册！'
        }
        flag=true;
        i=figure.length;
      }
    }
    if(!flag){
      var id = Date.now()+parseInt(Math.random()*999)+parseInt(Math.random()*2222)+'';
      var object = await query('INSERT INTO userlist(id,username,passwd,em_ph) VALUES ($1,$2,$3,$4)',[id,id,passwd,em_ph]);
      obj = {
        success:true,
        message:'register success'
      }
    }
    res.send(obj);
  });
});
/**
 * 用户登录 ok
 * */
app.post('/login',(req,res)=>{
  var str = '';
  var em_ph,passwd,obj;
  var flag = false;
  req.on('data',function(data){
    str += data;
  });            
  req.on("end",async ()=> {
    var json = JSON.parse(str);
    em_ph = json.em_ph;
    passwd = json.passwd;
    var figure = await query('SELECT id,username,passwd,em_ph,headsrc FROM userlist',[]);
    for(var i=0;i<figure.length;i++){
      if(figure[i].em_ph == em_ph && figure[i].passwd == passwd){
        obj={
          success:true,
          data:figure[i]
        }
        i = figure.length;
        flag = true;
      }
    }
    if(!flag){
      obj={
        success:false,
        message:'login fail'
      }
    }
    res.send(obj);
  });
});
/**
 * 新建笔记仓库 ok 4.28更新
 * */
app.post('/notecreate',(req,res)=>{
  var str = '';
  var uid,username,title,description,content,time,ispub,authority;
  var myDate = new Date();
  time = myDate.toLocaleString();      
  authority=true;
  req.on('data',function(data){
    str += data;
  });            
  req.on("end",async () => {
    var json = JSON.parse(str);
    uid = json.uid;
    //username = json.username;
    title = json.title;
    description = json.description;
    content = json.content;
    //time = json.time;
    ispub = json.ispub;
    var figure = await query('SELECT username FROM userlist where id=$1',[uid]);
    username = figure[0].username;
    
    var nid = Date.now()+parseInt(Math.random()*999)+parseInt(Math.random()*2222)+'';
    var txtname = nid+'.txt';
    write_txt(content,txtname,function(flag){
      //console.log(txtname,flag,'新建笔记txt 写入成功');
    });
    content=txtname;
    var obj = await query('INSERT INTO note(id,uid,username,title,description,content,time,ispub,clone,bid,buser,authority,version) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)',[nid,uid,username,title,description,content,time,ispub,true,uid,username,authority,true]);
    obj = {
      success:true,
      message:'create success'
    }
    res.send(obj);  
  });
});
/**
 * 获取某个笔记详细信息 ok
 * */
app.get('/getnote/:id', async (req, res)=> {
  var id = req.params.id;
  var figure = await query('SELECT id,uid,username,title,description,content,time,ispub,bid,buser,authority,copy_id,version,clone FROM note where id=$1',[id]);
  read_txt(figure[0].content,function(filedata){
    figure[0].content = filedata;
    var obj = {
      success:true,
      data:figure
    }
    res.send(obj);
  });
});
/**
 * 获取某用户所有笔记仓库 ok
 * */ 
app.get('/allnotes/:id', async (req, res)=> {
  var id = req.params.id;  
  var figure = await query('SELECT id,uid,username,title,description,content,time,ispub,clone,bid,buser,authority,copy_id,version FROM note where uid=$1',[id]);
  for(var i=0;i<figure.length;i++){
    read_txt(figure[i].content,function(filedata,name){
      var flag=false;
      for(var i=0;i<figure.length;i++){
        var key = figure[i].id+'.txt';
        if(key==name){
          figure[i].content=filedata;
          if(i==figure.length-1){
            flag=true;
          }
        }
      }
      if(flag){
        var obj = {
          success:true,
          data:figure
        }
        res.send(obj);
      }  
    });
  }
  
});

/**
 * 修改笔记仓库内容 源仓库和无权限的克隆仓库可调用进行更新 保存笔记 ok  4.27更新
 * */
app.post('/updatenote',(req,res)=>{
  var str = '';
  var id,content,time;
  var myDate = new Date();
  time = myDate.toLocaleString();        
  req.on('data',function(data){
    str += data;
  });            
  req.on("end",async () => {
    var json = JSON.parse(str);
    id = json.id;
    content = json.content;
    //time = json.time;
    var q1 = await query('SELECT copy_id FROM note WHERE id=$1',[id]);
    if(q1[0].copy_id==''){ //代表源仓库，源仓库更新提醒其克隆仓库需pull
      var q2 = await query('SELECT id,version FROM note WHERE copy_id=$1',[id]);
      if(q2.length>0){
        for(var i=0;i<q2.length;i++){
          if(q2[i].version){
            var q3 = await query('UPDATE note SET version=$1 WHERE id=$2',[false,q2[i].id]);
          }          
        }
      }
    }
    var txtname = id + '.txt';
    write_txt(content,txtname,function(flag){
      console.log(txtname,flag);
      if(flag){
        var obj = {
          success:true,
          message:'save success'
        }
        res.send(obj); 
      }
    });
    //var obj = await query('UPDATE note SET content=$1,time=$2 WHERE id=$3',[content,time,id]);
     
  });
});
/**
 * 用户更新头像 
 * */
var upload = multer({dest:'uploads/'});
app.post('/headimg/:id',upload.single('image'),(req,res) => {
  var id = req.params.id;
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
      var obj = await query('UPDATE userlist SET headimg=$1 WHERE id=$2',[userimg,id]);
      res.send({
        success:true,
        message:'update success'
      });     
  });
});
/**
 * 获取用户头像 
 * */
app.get('/gethead/:id',async (req,res) => {
  var id = req.params.id;
  var userimg;
  var figure = await query('SELECT headsrc FROM userlist where id=$1',[id]);
  if(figure[0].headsrc != ''){
    console.log(figure[0].headsrc+'读取');
    userimg = path.join(__dirname,figure[0].headsrc);
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
/**
 * 删除某个笔记仓库 ok  4.28更新
 *  */
app.delete('/delnote/:id',async (req,res) => {
  var id = req.params.id;
  var q1 = await query('SELECT id FROM note WHERE copy_id=$1',[id]);
  if(q1.length>0){
    for(var i=0;i<q1.length;i++){
      var q2 = await query('SELECT uid,username FROM note WHERE id=$1',[q1[i].id]);
      var uid = q2[0].uid;
      var username  = q2[0].username;
      var q3 = await query('UPDATE note SET uid=$1,username=$2,authority=$3,copy_id=$4,clone=$5 WHERE id=$6',[uid,username,true,'',true,q1[i].id]);
    }
  }
  var src = path.join(__dirname,'routes/notes/usernotes_txt/'+id+'.txt');
  fs.unlink(src,(err)=>{
    if(err) throw err;
    console.log('成功删除');
  });
  var obj = await query('DELETE FROM note where id=$1',[id]);
  obj = {
    success:true,
    message:'delete success'
  };
  res.send(obj);
});
/**
 * 克隆他人开源笔记仓库  ok  注意：clone=false  区分首次克隆还是二次克隆（更新克隆） 4.27更新
 * */
app.post('/clone',async (req,res) => {
  var str = '';
  var flag=false;
  var nid,uid,username,title,description,content,time,ispub,bid,buser,authority,num;
  var myDate = new Date();
  time = myDate.toLocaleString();        
  authority = false;
  ispub = true;
  req.on('data',function(data){
    str += data;
    console.log(str);
  });            
  req.on("end",async () => {
    var json = JSON.parse(str);
    nid = json.nid;
    uid = json.uid;
    //username = json.username;
    var uname = await query('SELECT username FROM userlist where id=$1',[uid]);
    username = uname[0].username;
    var figure1 = await query('SELECT uid,username,title,description,content,time,ispub,bid,buser FROM note where id=$1',[nid]);
    bid = figure1[0].bid;
    buser = figure1[0].buser;
    title = figure1[0].title;
    description = figure1[0].description;

    var all = await query('SELECT id,uid,copy_id FROM note',[]);
    for(i=0;i<all.length;i++){
      if(uid==all[i].uid && nid==all[i].copy_id){  //该uid用户非首次克隆该nid笔记 则不是克隆而是更新
        console.log('更新克隆');
        var key = all[i].id;
        var obj = await query('UPDATE note SET title=$1,description=$2,time=$3,version=$4 WHERE id=$5',[title,description,time,true,key]);
        flag=true;
        num=all[i].id;
        i=all.length;
      }
    }
    if(!flag){ //首次克隆
      console.log('首次克隆');
      num = Date.now()+parseInt(Math.random()*999)+parseInt(Math.random()*2222)+'';
      content = num+'.txt';
      var obj = await query('INSERT INTO note(id,uid,username,title,description,content,time,ispub,clone,bid,buser,authority,copy_id,version) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)',[num,uid,username,title,description,content,time,ispub,false,bid,buser,authority,nid,true]);
    }
    var name = nid+'.txt';
    var txtname = num+'.txt';
    read_txt(name,function(filedata,filename){
      console.log(filedata,'外层');
      write_txt(filedata,txtname,function(f){
        console.log(txtname,f);
        if(f){
          var obj = {
            success:true,
            message:'clone success'
          };
          res.send(obj);
        }
        
      });
    });
    
  });
});
/**
 * 原创是否授权他人推送源笔记仓库  ok
 * */
app.post('/agree',async (req,res) => {
  var str = '';
  var nid,uid,flag;
  req.on('data',function(data){
    str += data;
    console.log(str);
  });            
  req.on("end",async () => {
    var json = JSON.parse(str);
    nid = json.nid;
    uid = json.uid;
    flag = json.flag;
    var obj = await query('UPDATE note SET authority=$1 WHERE uid=$2 and copy_id=$3',[flag,uid,nid]);
    obj = {
      success:true,
      message:'set authority success'
    };
    res.send(obj);
  });
});

/**
 * 用户某源仓库获取所有克隆本仓库的用户信息（用于授权） ok
 * */
app.get('/copeuser/:id',async (req,res) => {
  var id = req.params.id;
  var figure = await query('SELECT uid,username,authority,copy_id FROM note WHERE copy_id=$1',[id]);
  let obj = {
    success:true,
    data:figure
  }
  console.log(obj,'该笔记的克隆用户信息');
  res.send(obj);
});
/**
 * 克隆仓库的更新，同步推送此克隆仓库和原仓库（有权限时调用）ok 4.27更新
 * */
app.post('/teampush',async (req,res) => {  //前端检查是否authority=true，后端再次审查  
  var str = '';
  var id,content,time,obj;
  var myDate = new Date();
  time = myDate.toLocaleString();      
  req.on('data',function(data){
    str += data;
    console.log(str);
  });            
  req.on("end",async () => {
    var json = JSON.parse(str);
    id = json.id;
    content = json.content;
  
    var figure = await query('SELECT copy_id,authority,version FROM note WHERE id=$1',[id]);
    var copy_id = figure[0].copy_id;

    if(figure[0].authority){
      if(figure[0].version){
        var q1 = await query('UPDATE note SET version=$1 WHERE id=$2',[false,copy_id]);
        var q2 = await query('SELECT id FROM note WHERE copy_id=$1 and id!=$2',[copy_id,id]);
        for(var i=0;i<q2.length;i++){
          var q3 = await query('UPDATE note SET version=$1 WHERE id=$2',[false,q2[i].id]);
        }
        obj = await query('UPDATE note SET time=$1 WHERE id=$2 or id=$3',[time,id,copy_id]);  //笔记更新时直接覆盖了原笔记
        var txtname = id+'.txt';
        write_txt(content,txtname,function(flag){
          console.log(txtname,flag);
        });
        var txtname2 = copy_id+'.txt';
        write_txt(content,txtname2,function(flag){
          console.log(txtname2,flag);
        });
        obj = {
          success:true,
          message:'push success'
        }
      }else{
        obj = {
          success:false,
          message:'please clone and update note again!'
        }
      }
      
    }else{
      obj = await query('UPDATE note SET time=$1 WHERE id=$2',[time,id]);  //笔记更新时直接覆盖了原笔记
      var txtname = id+'.txt';
      write_txt(content,txtname,function(flag){
        console.log(txtname,flag);
      });
      obj = {
        success:false,
        message:'no authority push!clone note push success,but origin note push fail!'
      }
    }
    res.send(obj);    
  });
});

/**
 * 是否同意分享 ok
 */
app.get('/setShare/:flag',async (req,res) => {
  var myobj = querystring.parse(req.params.flag);
  console.log(myobj,myobj.id,myobj.flag,'分享');
  var obj = await query('UPDATE note SET ispub=$1 WHERE id=$2',[myobj.flag,myobj.id]);
  obj = {
    success:true,
    message:'share set success'
  }
  res.send(obj);  
});

/**
 * 是否同意开源（克隆）ok
 */
app.get('/setClone/:flag',async (req,res) => {
  var myobj = querystring.parse(req.params.flag);
  console.log(myobj,myobj.id,myobj.flag,'克隆');
  var obj = await query('UPDATE note SET clone=$1 WHERE id=$2',[myobj.flag,myobj.id]);
  obj = {
    success:true,
    message:'clone set success'
  }
  res.send(obj);  
});

/**
 * 功能：获取分享列表 ok
 *  */
app.get('/share',async (req,res) => {
  var figure = await query('SELECT id,uid,username,title,description,content,time,bid,buser,ispub,clone,copy_id,authority,version FROM note where ispub=$1',[true]);
  // var data = [];  
  // for(var i=0;i<figure.length;i++){
  //   if(figure[i].uid == figure[i].bid){  //不包括克隆仓库
  //     data.push(figure[i]);
  //   }
  // }
  for(var i=0;i<figure.length;i++){
    read_txt(figure[i].content,function(filedata,name){
      var flag=false;
      for(var i=0;i<figure.length;i++){
        var key = figure[i].id+'.txt';
        if(key==name){
          figure[i].content=filedata;
          if(i==figure.length-1){
            flag=true;
          }
        }
      }
      if(flag){
        var obj = {
          success:true,
          data:figure
        }
        console.log(obj,obj.data.length,'分享列表');
        res.send(obj);
      }  
    });
  }
  

});
/**
 * 功能：获取开源列表,所有可克隆的源仓库（不含克隆仓库） ok
 *  */
app.get('/getClone',async (req,res) => {
  var figure = await query('SELECT id,uid,username,title,description,content,time,bid,ispub,clone,copy_id,version FROM note where clone=$1',[true]);
  var data = [];  //可克隆的所有源仓库
  for(var i=0;i<figure.length;i++){
    if(figure[i].uid == figure[i].bid){
      data.push(figure[i]);
    }
  }
  for(var i=0;i<data.length;i++){
    read_txt(data[i].content,function(filedata,name){
      var flag=false;
      for(var i=0;i<data.length;i++){
        var key = data[i].id+'.txt';
        if(key==name){
          data[i].content=filedata;
          if(i==data.length-1){
            flag=true;
          }
        }
      }
      if(flag){
        var obj = {
          success:true,
          data:data
        }
        console.log(obj,obj.data.length,'开源可克隆列表');
        res.send(obj);
      }  
    });
  }
  if(data.length==0){
    var obj = {
      success:true,
      data:data
    }
    res.send(obj);
  }
});
/**
 * 访问媒体文件 ok
 * */
app.get('/getmediafile/:src',async (req,res) => {
  var src = './routes/media/file/'+req.params.src;
  var mediasrc = path.join(__dirname,src);
  fs.readFile(mediasrc,function(err,filedata){
    if(err){
      console.log(err);
      return;
    }else{
      res.write(filedata);
      res.end();
    }
  });
});

/**
 * content内容写入txt文件测试
 */
app.get('/writetxt',async (req,res) => {
  // var figure = await query('SELECT id,content FROM note',[]);
  // for(var i=0;i<figure.length;i++){
  //   var txtname = figure[i].id+'.txt';
  //   var str = figure[0].content;
    // write_txt(str,txtname,function(flag){
    //   console.log(txtname,flag);
    // });
  //   var obj = await query('UPDATE note SET content=$1 WHERE id=$2',[txtname,figure[i].id]);
  // }
  res.send('end');
  
});
app.get('/readtxt',async (req,res) => {
  var name = '1619153481639.txt';
  read_txt(name,function(filedata){
    console.log(filedata,'外层');
    var obj = {
      success:true,
      data:filedata
    };
    res.send(obj);
  });
  
});







// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
//app.use('/register',register_user);
app.use('/userlist',search_user);
app.use('/mynote',mynote);
app.use('/img',img_up);
app.use('/getimg',img_get);
app.use('/audionote',audio_up);
app.use('/getaudio',audio_get);
app.use('/video',video_up);
app.use('/getvideo',video_get);

app.use('/mediaUpload',media_up); //媒体文件上传
//app.use('/getmedia',media_get);
//app.use('/share',share); //广场知识分享 获取所有原作者笔记仓库






// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//module.exports = app;
app.listen(8002);
