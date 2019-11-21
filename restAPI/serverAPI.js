var http = require("http");
var fs = require("fs");
var url = require("url");

var sqlCon = require("./sqlCon.js");

var testData = (res,con,db) =>
{
    var data =
    {
        rooms:
            [
                { Navn: "'Lokale 1'", Beskrivelse: "'Stuen'" },
                { Navn: "'Lokale 2'", Beskrivelse: "'Stuen'" },
                { Navn: "'Lokale 3'", Beskrivelse: "'Stuen'" },
                { Navn: "'Lokale 4'", Beskrivelse: "'Første sal'" },
                { Navn: "'Lokale 5'", Beskrivelse: "'Første sal'" },
                { Navn: "'Lokale 6'", Beskrivelse: "'Første sal Køkken'" }
            ],
        reservation:
            [
                { RoomId: 1, Dato: "STR_TO_DATE('2019-10-15 10:00:00','%Y-%m-%d %H:%i:%s')", Ansvarlig: "'Ole'" },
                { RoomId: 2, Dato: "STR_TO_DATE('2019-11-14 12:00:00','%Y-%m-%d %H:%i:%s')", Ansvarlig: "'Ib'" },
                { RoomId: 1, Dato: "STR_TO_DATE('2019-12-13 08:00:00','%Y-%m-%d %H:%i:%s')", Ansvarlig: "'Mads'" },
                { RoomId: 3, Dato: "STR_TO_DATE('2019-11-14 14:00:00','%Y-%m-%d %H:%i:%s')", Ansvarlig: "'Jakup'" },
                { RoomId: 6, Dato: "STR_TO_DATE('2019-12-24 18:00:00','%Y-%m-%d %H:%i:%s')", Ansvarlig: "'Henrik'" },
                { RoomId: 1, Dato: "STR_TO_DATE('2019-12-08 11:30:00','%Y-%m-%d %H:%i:%s')", Ansvarlig: "'Ian'" }
            ]
    };

    var columbName = "";
    var columbData = "";
    for (var table in data)
    {
        for (var rows in data[table])
        {
            columbNames = "";
            columbData = "";
            for (var columb in data[table][rows])
            {
                if (columbNames != "") columbNames += "," + columb; else columbNames += columb;
                if (columbData != "") columbData += "," + data[table][rows][columb]; else columbData += data[table][rows][columb];
            }
            con.query("INSERT INTO " + db + "." + table + " (" + columbNames + ") VALUES(" + columbData + ")", function (err, data) { });
        }
    }
    res.end();
}



var server = http.createServer(function(req,res) 
{  
        con.query("USE " + db, function (err, data) {if (err != null) { sqlCon.makeDb(res, testData); }});
        var path = url.parse(req.url, true);
        var serverPath = "."+path.pathname;
        var filename = serverPath.split("/")[serverPath.split("/").length-1].split("?")[0];
        var query = path.query;
    //res.end(JSON.stringify(sqlCon)+JSON.stringify(query));
});

server.listen(8080);