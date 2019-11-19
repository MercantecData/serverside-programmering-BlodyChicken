var http = require("http");
var fs = require("fs");
var url = require("url");
var mime = require('mime-types');

var server = http.createServer(function(req,res) 
{  
    try
    {
        var path = url.parse(req.url, true);
        var serverPath = "."+path.pathname;
        var filename = serverPath.split("/")[serverPath.split("/").length-1].split("?")[0];
        var filetype = "";
        // provoke a server error 
        if (filename=="500") throw new Error('Error 505');

        if (filename!="")
        {
            // Get filetype
            if(filename.split(".").length>1) 
            {
                filetype = filename.split(".")[1];
                // set header på file types
                if (mime.lookup(filetype)) res.setHeader("Content-Type", mime.lookup(filetype));
            }
            // no filetype asume its a folder and set standart document
            if(filetype=="") serverPath=serverPath+"/index.htm";
        }else
        {
            // no filename set standart filename in folder
            serverPath=serverPath+"index.htm";
        }
        // get file and send to client
        fs.readFile(serverPath, function(err, data) 
        {
            // no file found send error to client
            if (err!=null) data=path.pathname+"\n404 Not Found";
            res.end(data);
        }); 
    }catch(e)
    {
        // if server error send error to client
        res.end("500 Internal Server Error\n");
    }
});
server.listen(8080);