var express = require('express');
var pgdb = require('../pg');
var router = express.Router();


/**注册新用户 */
router.post('/',(req,res) => {
  const { str } = req.body;
  console.log(str,'ssss');
  // var figure = query('SELECT id,username,passwd,email,phone  FROM userlist',[]);
    // let obj = {
    //   status:0,
    //   data:JSON.parse(JSON.stringify(figure))
    // }
    // console.log(obj);
    // res.send(obj);
  res.send('ok');
  
});



module.exports = router;
