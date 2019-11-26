var mysql = require("mysql");
var con = mysql.createConnection({ host: "localhost", user: "root", password: "", timezone:"UTC" });
var db = "booking";
var tables = ["rooms","reservation"];
var columbs = { rooms: ["Navn VARCHAR(50)", "Beskrivelse VARCHAR(255)"], reservation: ["LokaleId INT", "FraDato DATETIME", "TilDato DATETIME", "Ansvarlig VARCHAR(50)", "OpdateringsDato DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"] };

exports.checkForDb = (req, res, testData, makeDatabase, handleRequest) =>
{
	con = mysql.createConnection({ host: "localhost", user: "root", password: "", timezone: "UTC" });

	con.connect(function (err)
	{
		if (err != null) 
			res.end("Error:" + err + "\n");
		else
			con.query("USE " + db, function (err, data)
			{
				if (err != null && makeDatabase) exports.makeDb(req, res, testData); else handleRequest(req, res,con);
			});
	});
}

exports.makeDb = (req, res, testData) =>
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
        			testData(req, res, con, db);
        		});
    		}
		});
    			
	});
}