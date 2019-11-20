var http = require("http");
var fs = require("fs");
var url = require("url");

var b = (res) => { res.end(); }

var server = http.createServer(function(req,res) 
{  
    var sqlCon = require("./sqlCon.js");
    sqlCon.makeDb(res, b);

        var path = url.parse(req.url, true);
        var serverPath = "."+path.pathname;
        var filename = serverPath.split("/")[serverPath.split("/").length-1].split("?")[0];
        var query = path.query;
    //res.end(JSON.stringify(sqlCon)+JSON.stringify(query));
});

server.listen(8080);