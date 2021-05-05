var fs = require('fs');
var path = require('path');


function readtxt(txtname,callback){
    var src = path.join(__dirname,'usernotes_txt/'+txtname);
    fs.readFile(src,'utf-8',function(err,filedata){
        if(err){
            return callback(err,txtname);
        }else{
            callback(filedata,txtname);
        }
    });
    return true;
}


module.exports = readtxt;