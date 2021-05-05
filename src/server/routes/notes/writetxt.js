var fs = require('fs');
var path = require('path');

function writetxt(content,txtname,callback){
    var src = path.join(__dirname,'usernotes_txt/'+txtname);
    fs.writeFile(src,content,(err)=>{
        if(err){
            return callback(false);
        }
        callback(true);
    });
    
    return true;
}


module.exports = writetxt;