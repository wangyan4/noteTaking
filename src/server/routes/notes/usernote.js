var express = require('express');
var query = require('../pg');
var router = express.Router();


/**查询用户笔记仓库列表 */
router.get('/', async (req, res) => {
    console.log('笔记');
    var figure = await query('SELECT id uid,username,title,description,content,time,ispub,bid,buser,authority from note',[]);
    let obj = {
      status:0,
      data:figure
    }
    console.log(obj);
    res.send(obj);
});
  

module.exports = router;
