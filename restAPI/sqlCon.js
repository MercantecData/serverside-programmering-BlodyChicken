var mysql = require("mysql");
var con = mysql.createConnection({ host: "localhost", user: "root", password: "" });
var db = "booking";
var tables = {name:"rooms"};
var columbs = "Navn VARCHAR(50)";
con.connect(function(err)
{
    if (err!=null) 
    {
        res.end("Error:" + err + "\n");
    }
    else
    { 
    	con.query("USE "+db, function (err, data)
    	{
    		if (err != null)
    		{
        		con.query("CREATE DATABASE "+db, function (err, data)
        		{
        			if (err != null) res.end("Error Creating DB:"+db);
        			else
        				con.query("CREATE TABLE "+db+"."+tables+" (PNR INT NOT NULL AUTO_INCREMENT, PRIMARY KEY (PNR))", function (err, data) {
        					if (err != null) res.end("Error Creating Table: " + tables);
        					else
        						con.query("ALTER TABLE " + db + "." + tables + " ADD " + columbs , function (err, data) {
        							if (err != null) res.end("Error Creating Columb: " + columbs);
        						});
        				});
        		});
        	}
        });
	}
});