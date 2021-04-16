var express = require('express');
var query = require('../pg');
var router = express.Router();


/**广场分享 获取所有开源笔记仓库 */
router.get('/share', async (req,res) => {
    var figure = await query('SELECT id,uid,username,title,description,content,time,bid,buser FROM note where ispub=$1',[true]);
    var data = [];
    for(var i=0;i<figure.length;i++){
        if(figure[i].uid == figure[i].bid){
            data.push(figure[i]);
        }
    }
    let obj = {
        status:0,
        data:figure
    }
    console.log(obj);
    res.send(obj);
});
  

module.exports = router;
