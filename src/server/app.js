var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var fs = require('fs');

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
      var id = figure.length+1;
      var object = await query('INSERT INTO userlist(id,username,passwd,em_ph) VALUES ($1,$2,$3,$4)',[id,em_ph,passwd,em_ph]);
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
    var figure = await query('SELECT passwd,em_ph FROM userlist',[]);
    for(var i=0;i<figure.length;i++){
      if(figure[i].em_ph == em_ph && figure[i].passwd == passwd){
        obj={
          success:true,
          message:'login success'
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
 * 新建笔记仓库 
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
    username = json.username;
    title = json.title;
    description = json.description;
    content = json.content;
    //time = json.time;
    ispub = json.ispub;
    var figure = await query('SELECT id FROM note',[]);
    var arr = [];
    for(var i=0;i<figure.length;i++){
      var id = Number(figure[i].id); //转字符为数字
      arr.push(id);
    }
    var max = Math.max.apply(null, arr);
    var nid = max+1;
    var obj = await query('INSERT INTO note(id,uid,username,title,description,content,time,ispub,bid,buser,authority) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)',[nid,uid,username,title,description,content,time,ispub,uid,username,authority]);
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
 * 获取某用户所有笔记仓库 
 * */ 
app.get('/allnotes/:id', async (req, res)=> {
  var id = req.params.id;
  var figure = await query('SELECT id,uid,username,title,description,content,time,ispub,bid,buser,authority FROM note where uid=$1',[id]);
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
  time = myDate.toLocaleString( );        //获取日期与时间
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
 * 克隆他人开源笔记仓库  ok
 * */
app.post('/clone',async (req,res) => {
  var str = '';
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
    username = json.username;
    var figure1 = await query('SELECT uid,username,title,description,content,time,ispub,bid,buser FROM note where id=$1',[nid]);
    bid = figure1[0].bid;
    buser = figure1[0].buser;
    title = figure1[0].title;
    description = figure1[0].description;
    content = figure1[0].content;
    
    var figure2 = await query('SELECT id FROM note',[]);
    var arr = [];
    for(var i=0;i<figure2.length;i++){
      var id = Number(figure2[i].id); //转字符为数字
      arr.push(id);
    }
    var max = Math.max.apply(null, arr);
    var num = max+1;
    var obj = await query('INSERT INTO note(id,uid,username,title,description,content,time,ispub,bid,buser,authority) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)',[num,uid,username,title,description,content,time,ispub,bid,buser,authority]);
    obj = {
      success:true,
      message:'clone success'
    };
    res.send(obj);
  });
});
/**
 * 原创授权他人更新推送源笔记仓库 
 * */
app.post('/agree',async (req,res) => {
  var str = '';
  var title,uid,bid;
  req.on('data',function(data){
    str += data;
    console.log(str);
  });            
  req.on("end",async () => {
    var json = JSON.parse(str);
    title = json.title;
    uid = json.uid;
    bid = json.bid;
    var obj = await query('UPDATE note SET authority=$1 WHERE uid=$2 and title=$3 and bid=$4',[true,uid,title,bid]);
    obj = {
      success:true,
      message:'agree success'
    };
    res.send(obj);
  });
});
/**
 * 取消授权他人更新推送源笔记仓库 
 * */
app.post('/refuse',async (req,res) => {
  var str = '';
  var title,uid,bid;
  req.on('data',function(data){
    str += data;
    console.log(str);
  });            
  req.on("end",async () => {
    var json = JSON.parse(str);
    title = json.title;
    uid = json.uid;
    bid = json.bid;
    var obj = await query('UPDATE note SET authority=$1 WHERE uid=$2 and title=$3 and bid=$4',[false,uid,title,bid]);
    obj = {
      success:true,
      message:'refuse success'
    };
    res.send(obj);
  });
});
/**
 * 原创获取所有克隆本仓库的用户 
 * */
app.get('/copeuser/:id',async (req,res) => {
  var id = req.params.id;
  var figure = await query('SELECT title,bid FROM note WHERE id=$1',[id]);
  var bid = figure[0].bid;
  var title = figure[0].title;
  var figure2 = await query('SELECT uid,username,authority FROM note WHERE bid=$1 and title=$2 and uid!=bid',[bid,title,bid]);
  let obj = {
    success:true,
    data:figure2
  }
  console.log(obj);
  res.send(obj);
});
/**
 * 授权用户同步推送自己仓库和原仓库 
 * */
app.post('/otherudt',async (req,res) => {
  var str = '';
  var id,content,time;
  req.on('data',function(data){
    str += data;
    console.log(str);
  });            
  req.on("end",async () => {
    var json = JSON.parse(str);
    id = json.id;
    content = json.content;
    time = json.time;
    var figure = await query('SELECT authority,bid,title FROM note WHERE id=$1',[id]);
    
    if(figure[0].authority){
      var bid = figure[0].bid;
      var title = figure[0].title;
      var obj = await query('UPDATE note SET content=$1,time=$2 WHERE bid=$3 and uid=$4 and title=$5',[content,time,bid,bid,title]);
      var obj2 = await query('UPDATE note SET content=$1,time=$2 WHERE id=$3',[content,time,id]);
      obj = {
        success:true,
        message:'push success'
      }
      res.send(obj);  
    }else{
      var obj3 = await query('UPDATE note SET content=$1,time=$2 WHERE id=$3',[content,time,id]);
      obj3 = {
        success:true,
        message:'no authority,push fail!'
      }
      res.send(obj3);  
    }  
  });
});

/**
 * 功能：获取开源仓库列表（分享广场）ok
 *  */
app.get('/share',async (req,res) => {
  var figure = await query('SELECT id,uid,username,title,description,content,time,bid,buser FROM note where ispub=$1',[true]);
    var data = [];
    for(var i=0;i<figure.length;i++){
        if(figure[i].uid == figure[i].bid){
            data.push(figure[i]);
        }
    }
    let obj = {
        success:true,
        data:data
    }
    console.log(obj,obj.data.length,'笔记列表长度');
    res.send(obj);
});
/**
 * 访问媒体文件 
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
