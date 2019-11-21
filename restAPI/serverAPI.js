var http = require("http");
var fs = require("fs");
var url = require("url");

var sqlCon = require("./sqlCon.js");

var testData = (req,res,con,db) =>
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
                { LokaleId: 1, FraDato: "STR_TO_DATE('2019-10-15 10:00:00','%Y-%m-%d %H:%i:%s')", TilDato: "STR_TO_DATE('2019-10-15 11:00:00','%Y-%m-%d %H:%i:%s')", Ansvarlig: "'Ole'" },
                { LokaleId: 2, FraDato: "STR_TO_DATE('2019-11-14 12:00:00','%Y-%m-%d %H:%i:%s')", TilDato: "STR_TO_DATE('2019-10-15 13:00:00','%Y-%m-%d %H:%i:%s')", Ansvarlig: "'Ib'" },
                { LokaleId: 1, FraDato: "STR_TO_DATE('2019-12-13 08:00:00','%Y-%m-%d %H:%i:%s')", TilDato: "STR_TO_DATE('2019-10-15 09:00:00','%Y-%m-%d %H:%i:%s')", Ansvarlig: "'Mads'" },
                { LokaleId: 3, FraDato: "STR_TO_DATE('2019-11-14 14:00:00','%Y-%m-%d %H:%i:%s')", TilDato: "STR_TO_DATE('2019-10-15 15:00:00','%Y-%m-%d %H:%i:%s')", Ansvarlig: "'Jakup'" },
                { LokaleId: 6, FraDato: "STR_TO_DATE('2019-12-24 18:00:00','%Y-%m-%d %H:%i:%s')", TilDato: "STR_TO_DATE('2019-10-15 19:00:00','%Y-%m-%d %H:%i:%s')", Ansvarlig: "'Henrik'" },
                { LokaleId: 1, FraDato: "STR_TO_DATE('2019-12-08 11:30:00','%Y-%m-%d %H:%i:%s')", TilDato: "STR_TO_DATE('2019-10-15 12:00:00','%Y-%m-%d %H:%i:%s')", Ansvarlig: "'Ian'" }
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
            res.write(columbNames + "-" + columbData+'\n');
            con.query("INSERT INTO " + db + "." + table + " (" + columbNames + ") VALUES(" + columbData + ")", function (err, data) { });
        }
    }
    handleRequest(req, res, con);
}


var handleRequest = (req, res, con) =>
{
    /*
    var path = url.parse(req.url, true);
    var serverPath = "." + path.pathname;
    var filename = serverPath.split("/")[serverPath.split("/").length - 1].split("?")[0];
    var query = path.query;
    */
    if (req.url.split("?")[0] == "/booking")
        con.query("SELECT * FROM booking.reservation", function (err, data) {
            res.write(JSON.stringify(data, null, '\t'));
            res.end("\nRequest End!");
        });
    else
    res.end("End request");
}

var server = http.createServer(function (req, res)
{
    sqlCon.checkForDb(req, res, testData, true, handleRequest);
});
server.listen(8080);