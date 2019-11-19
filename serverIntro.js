var http = require("http");
var mysql = require("mysql");
var url = require("url");

var server = http.createServer(function(req,res) 
{  
    /*********************************************** SQL*********************************************************** */
    var con = mysql.createConnection({host:"localhost",user:"root",password:""});
    con.connect(function(err)
    {
        if (err!=null) 
        {
            res.write("Error:"+err+"\n");
            res.end("\nRequest End!");
        }
        else
        {
            con.query("USE nodejs", function(err,data) 
            {
                if (err!=null) 
                {
                    con.query("CREATE DATABASE nodejs;", function(err,data) 
                    {
                        if (err!=null) res.end("Error Creating DB nodejs");
                        else   
                        con.query("CREATE TABLE nodejs.Names (PNR INT NOT NULL AUTO_INCREMENT,Navn VARCHAR(50), PRIMARY KEY (PNR))", function(err,data) 
                        {
                            if (err!=null) res.end("Error Creating Table names");
                            res.end("Type view or Add in url (localhost:8080/view)");
                        });
                    });
                }else          
                if (req.url=="/view")
                con.query("SELECT * FROM nodejs.names", function(err,data) 
                {
                    res.write("SELECT:\n");
                    res.write(JSON.stringify(data));
                    res.end("\nRequest End!");
                });
                else
                if (req.url=="/add")
                con.query("INSERT INTO nodejs.names (Navn) VALUES ('D')", function(err,data) 
                {
                    res.write("INSERT:");
                    res.write(JSON.stringify(data));
                    res.end("\nRequest End!");
                    
                });
                else
                {
                    res.end("Type view or Add in url (localhost:8080/view)");
                }
            });
        }
    }); 
});
server.listen(8080);