var mysql = require("mysql");
var con = mysql.createConnection({ host: "localhost", user: "root", password: "" });
var db = "booking";
var tables = ["rooms","reservation"];
var columbs = { rooms: ["Navn VARCHAR(50)", "Beskrivelse VARCHAR(255)"], reservation: ["RoomId INT", "Dato DATETIME", "Ansvarlig VARCHAR(50)"] };

exports.makeDb = (res, callback) =>
{
	con.connect(function(err)
	{
		if (err!=null) 
		{
			res.end("Error:" + err + "\n");
		}
		else
		{
			con.query("DROP DATABASE IF EXISTS " + db, function (err, data)
			{ 
    			con.query("USE "+db, function (err, data)
    			{
    				if (err != null)
    				{
        				con.query("CREATE DATABASE "+db, function (err, data)
        				{
        					if (err != null) res.end("Error Creating DB:" + db);
        					else
        					{								
        						for (var tableName in tables)
        						{
        							var columb = "";
        							for (var columbName in columbs[tables[tableName]])
        							{
         								columb += ", " + columbs[tables[tableName]][columbName];
        							}
									con.query("CREATE TABLE " + db + "." + tables[tableName] + " (PNR INT NOT NULL AUTO_INCREMENT" + columb + ", PRIMARY KEY (PNR))", function (err, data)
									{
										if (err != null) res.end("Error Creating Table: " + tables);									
									});
        						}								       						
        					}
        					callback(res,con,db);
        				});
    				}
    			});
    			
			});
		}
	});
}