var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var query = require('./routes/pg');
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
      status:0,
      data:['ok']
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
    var nid = figure.length+1;
    var obj = await query('INSERT INTO note(id,uid,username,title,description,content,time,ispub,bid,buser,authority) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)',[nid,uid,username,title,description,content,time,ispub,uid,username,authority]);
    obj = {
      status:0,
      data:['ok']
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
