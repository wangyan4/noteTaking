var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var multer = require('multer');
var query = require('./routes/pg');
var rnum = require('../random');
var indexRouter = require('./routes/index');
//var register_user = require('./routes/users/register');
var search_user = require('./routes/users/search');
var img_up = require('./routes/img_test/img');
var img_get = require('./routes/img_test/getimg');
var audio_up = require('./routes/audio_test/audio');
var audio_get = require('./routes/audio_test/getaudio');
var video_up = require('./routes/video_test/video');
var video_get = require('./routes/video_test/getvideo');
// var note_content = require('./routes/notes/getnote');
var mynote = require('./routes/notes/usernote');
var share = require('./routes/notes/sharelist');

var app = express();

//数据测试
/**注册 */
app.post('/register',(req,res)=>{
  var str = '';
  var username,passwd,email,phone;
  req.on('data',function(data){
    str += data;
    console.log(str);
  });            
  req.on("end",async ()=> {
    var json = JSON.parse(str);
    username = json.username;
    passwd = json.passwd;
    email = json.email;
    phone = json.phone;
    var figure = await query('SELECT id FROM userlist',[]);
    var id = figure.length+1;
    var obj = await query('INSERT INTO userlist(id,username,passwd,email,phone) VALUES ($1,$2,$3,$4,$5)',[id,username,passwd,email,phone]);
    obj = {
      status:'register success'
    }
    res.send(obj);
  });
});
/**创建新笔记仓库 */
app.post('/notecreate',(req,res)=>{
  var str = '';
  var uid,username,title,description,content,time,ispub,authority;
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
    time = json.time;
    ispub = json.ispub;
    var figure = await query('SELECT id FROM note',[]);
    var nid = figure[figure.length-1].id+1;
    var obj = await query('INSERT INTO note(id,uid,username,title,description,content,time,ispub,bid,buser,authority) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)',[nid,uid,username,title,description,content,time,ispub,uid,username,authority]);
    obj = {
      status:'create success'
    }
    res.send(obj);  
  });
});
/**获取某个笔记详细信息 */
app.get('/getnote/:id', async (req, res)=> {
  var id = req.params.id;
  var figure = await query('SELECT title,description,content,time FROM note where id=$1',[id]);
  let obj = {
    status:0,
    data:figure
  }
  console.log(obj);
  res.send(obj);
});
/**获取某用户所有笔记仓库 */ //test
app.get('/allnotes/:id', async (req, res)=> {
  var id = req.params.id;
  var figure = await query('SELECT uid,title,description,content,time,ispub,bid FROM note where uid=$1',[id]);
  let obj = {
    status:0,
    data:figure
  }
  console.log(obj);
  res.send(obj);
});
/**用户登录 */
app.post('/login',(req,res)=>{
  var str = '';
  var loginid,passwd;
  var flag = false;
  req.on('data',function(data){
    str += data;
    console.log(str);
  });            
  req.on("end",async ()=> {
    var json = JSON.parse(str);
    loginid = json.loginid;
    passwd = json.passwd;
    var figure = await query('SELECT passwd,email,phone FROM userlist',[]);
    for(var i=0;i<figure.length;i++){
      if((figure[i].phone == loginid || figure[i].email == loginid) && figure[i].passwd == passwd){
        res.send({
          status:'login success'
        });
        i = figure.length;
        flag = true;
      }
    }
    if(!flag){
      res.send({
        status:'login fail'
      });
    }
  });
});
/**修改笔记仓库内容 */
app.post('/updatenote',(req,res)=>{
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
    var obj = await query('UPDATE note SET content=$1,time=$2 WHERE id=$3',[content,time,id]);
    obj = {
      status:'update success'
    }
    res.send(obj);  
  });
});
/**用户更新头像 */
var upload = multer({dest:'uploads/'});
router.post('/headimg/:id',upload.single('image'),(req,res) => {
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
        status:'update success'
      });     
  });
});
/**获取用户头像 */
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
/**删除某个笔记仓库 */
app.delete('/delnote/:id',async (req,res) => {
  var id = req.params.id;
  var obj = await query('DELETE FROM notes where id=$1',[id])
  res.send({
    status:'delete success'
  });
});
/**克隆他人开源笔记仓库 */
app.post('/clone',async (req,res) => {
  var str = '';
  var nid,uid,username,title,description,content,time,ispub,bid,buser,authority;
  var authority = false;
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
    buser = figure1[0].username;
    title = figure1[0].title;
    description = figure1[0].description;
    content = figure1[0].content;
    time = figure1[0].time;
    ispub = true;
    bid = figure1[0].uid;
    var figure2 = await query('SELECT id FROM note',[]);
    var num = figure2[figure2.length-1].id+1;
    var obj = await query('INSERT INTO note(id,uid,username,title,description,content,time,ispub,bid,buser,authority) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)',[num,uid,username,title,description,content,time,ispub,bid,buser,authority]);
    obj = {
      status:'clone success'
    };
    res.send(obj);
  });
});
/**原创授权他人更新推送源笔记仓库 */
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
      status:'agree success'
    };
    res.send(obj);
  });
});
/**取消授权他人更新推送源笔记仓库 */
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
      status:'refuse success'
    };
    res.send(obj);
  });
});
/**原创获取所有克隆本仓库的用户 */
app.get('/copeuser/:id',async (req,res) => {
  var id = req.params.id;
  var figure = await query('SELECT title,bid FROM note WHERE id=$1',[id]);
  var bid = figure[0].bid;
  var title = figure[0].title;
  var figure2 = await query('SELECT uid,username,authority FROM note WHERE bid=$1 and title=$2 and uid!=bid',[bid,title,bid]);
  let obj = {
    status:0,
    data:figure2
  }
  console.log(obj);
  res.send(obj);
});
/**授权用户同步推送自己仓库和原仓库 */
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
        status:'push success'
      }
      res.send(obj);  
    }else{
      var obj3 = await query('UPDATE note SET content=$1,time=$2 WHERE id=$3',[content,time,id]);
      obj3 = {
        status:'no authority,push fail!'
      }
      res.send(obj3);  
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
app.use('/share',share); //广场知识分享 获取所有原作者笔记仓库






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
