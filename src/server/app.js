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
    console.log(str);
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
      //var id = figure.length+1;
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
    console.log(str);
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
    console.log(obj,'yonhu')
    res.send(obj);
  });
});
/**
 * 新建笔记仓库 ok
 * */
app.post('/notecreate',(req,res)=>{
  var str = '';
  var uid,username,title,description,content,time,ispub,authority;
  var myDate = new Date();
  time = myDate.toLocaleString( );        //获取日期与时间
  authority=true;
  req.on('data',function(data){
    str += data;
    console.log(str);
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
    console.log(figure,'fff');
    username = figure[0].username;
    console.log(username,'uuu');
    // var arr = [];
    // for(var i=0;i<figure.length;i++){
    //   var id = Number(figure[i].id); //转字符为数字
    //   arr.push(id);
    // }
    // var max = Math.max.apply(null, arr);
    //var nid = max+1;
    var nid = Date.now()+parseInt(Math.random()*999)+parseInt(Math.random()*2222)+'';
    var obj = await query('INSERT INTO note(id,uid,username,title,description,content,time,ispub,clone,bid,buser,authority) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)',[nid,uid,username,title,description,content,time,ispub,false,uid,username,authority]);
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
  var figure = await query('SELECT id,uid,username,title,description,content,time,ispub,bid,buser,authority FROM note where id=$1',[id]);
  let obj = {
    success:true,
    data:figure
  }
  console.log(obj);
  res.send(obj);
});
/**
 * 获取某用户所有笔记仓库 ok
 * */ 
app.get('/allnotes/:id', async (req, res)=> {
  var id = req.params.id;
  var figure = await query('SELECT id,uid,username,title,description,content,time,ispub,clone,bid,buser,authority,copy_id FROM note where uid=$1',[id]);
  let obj = {
    success:true,
    data:figure
  }
  console.log(obj);
  res.send(obj);
});

/**
 * 修改笔记仓库内容 保存笔记 ok
 * */
app.post('/updatenote',(req,res)=>{
  var str = '';
  var id,content,time;
  var myDate = new Date();
  time = myDate.toLocaleString();        //获取日期与时间
  console.log('当前时间',time);
  req.on('data',function(data){
    str += data;
    console.log(str);
  });            
  req.on("end",async () => {
    var json = JSON.parse(str);
    id = json.id;
    content = json.content;
    //time = json.time;
    var obj = await query('UPDATE note SET content=$1,time=$2 WHERE id=$3',[content,time,id]);
    obj = {
      success:true,
      message:'save success'
    }
    res.send(obj);  
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
 * 删除某个笔记仓库 ok
 *  */
app.delete('/delnote/:id',async (req,res) => {
  var id = req.params.id;
  var obj = await query('DELETE FROM note where id=$1',[id]);
  obj = {
    success:true,
    message:'delete success'
  };
  res.send(obj);
});
/**
 * 克隆他人开源笔记仓库  ok  注意：clone=false  区分首次克隆还是二次克隆（更新克隆）
 * */
app.post('/clone',async (req,res) => {
  var str = '';
  var flag=false;
  var nid,uid,username,title,description,content,time,ispub,bid,buser,authority;
  var myDate = new Date();
  time = myDate.toLocaleString( );        //获取日期与时间
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
    content = figure1[0].content;

    var all = await query('SELECT id,uid,copy_id FROM note',[]);
    for(i=0;i<all.length;i++){
      if(uid==all[i].uid && nid==all[i].copy_id){  //该uid用户非首次克隆该nid笔记 则不是克隆而是更新
        console.log('更新克隆');
        var key = all[i].id;
        var obj = await query('UPDATE note SET title=$1,description=$2,content=$3,time=$4 WHERE id=$5',[title,description,content,time,key]);
        flag=true;
        i=all.length;
      }
    }
    if(!flag){ //首次克隆
      console.log('首次克隆');
      var num = Date.now()+parseInt(Math.random()*999)+parseInt(Math.random()*2222)+'';
      var obj = await query('INSERT INTO note(id,uid,username,title,description,content,time,ispub,clone,bid,buser,authority,copy_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)',[num,uid,username,title,description,content,time,ispub,false,bid,buser,authority,nid]);
    }
    var obj = {
      success:true,
      message:'clone success'
    };
    res.send(obj);
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
 * 克隆仓库的更新，同步推送此克隆仓库和原仓库（有权限时调用）ok （已测 有bug 直接覆盖了源仓库 非diff）
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
  
    var figure = await query('SELECT copy_id,authority FROM note WHERE id=$1',[id]);
    var copy_id = figure[0].copy_id;

    if(figure[0].authority){
      obj = await query('UPDATE note SET content=$1,time=$2 WHERE id=$3 or id=$4',[content,time,id,copy_id]);  //笔记更新时直接覆盖了原笔记
      obj = {
        success:true,
        message:'push success'
      }
    }else{
      obj = await query('UPDATE note SET content=$1,time=$2 WHERE id=$3',[content,time,id]);  //笔记更新时直接覆盖了原笔记
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
  var figure = await query('SELECT id,uid,username,title,description,content,time,bid,buser,ispub,clone,copy_id,authority FROM note where ispub=$1',[true]);
  // var data = [];  
  // for(var i=0;i<figure.length;i++){
  //   if(figure[i].uid == figure[i].bid){  //不包括克隆仓库
  //     data.push(figure[i]);
  //   }
  // }
  let obj = {
    success:true,
    data:figure
  }
  console.log(obj,obj.data.length,'分享列表');
  res.send(obj);
});
/**
 * 功能：获取开源列表,所有可克隆的源仓库（不含克隆仓库） ok
 *  */
app.get('/getClone',async (req,res) => {
  var figure = await query('SELECT id,uid,username,title,description,content,time,bid,ispub,clone,copy_id FROM note where clone=$1',[true]);
  var data = [];  //可克隆的所有源仓库
  for(var i=0;i<figure.length;i++){
    if(figure[i].uid == figure[i].bid){
      data.push(figure[i]);
    }
  }
  let obj = {
    success:true,
    data:data
  }
  console.log(obj,obj.data.length,'开源可克隆列表');
  res.send(obj);
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
