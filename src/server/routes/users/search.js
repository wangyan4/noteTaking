var express = require('express');
var query = require('../pg');
var router = express.Router();


/**查询用户列表 */
router.get('/', async (req, res) => {
    console.log('查询用户列表');
    var figure = await query('SELECT id,username,passwd,email,phone FROM userlist',[]);
    let obj = {
      success:true,
      data:JSON.parse(JSON.stringify(figure))
    }
    console.log(obj);
    res.send(obj);
});
  

module.exports = router;
