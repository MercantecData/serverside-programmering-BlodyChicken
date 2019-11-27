var http = require("http");
var fs = require("fs");
var url = require("url");
var querystring = require('querystring');
var getPostData = {};
var path;
var serverPath;
var validKeyCode = 123;

var sqlCon = require("./sqlCon.js");

// ******************************** Opret test data *****************************************
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
                { LokaleId: 2, FraDato: "STR_TO_DATE('2019-11-14 12:00:00','%Y-%m-%d %H:%i:%s')", TilDato: "STR_TO_DATE('2019-11-15 13:00:00','%Y-%m-%d %H:%i:%s')", Ansvarlig: "'Ib'" },
                { LokaleId: 1, FraDato: "STR_TO_DATE('2019-12-13 08:00:00','%Y-%m-%d %H:%i:%s')", TilDato: "STR_TO_DATE('2019-12-13 09:00:00','%Y-%m-%d %H:%i:%s')", Ansvarlig: "'Mads'" },
                { LokaleId: 3, FraDato: "STR_TO_DATE('2019-11-14 14:00:00','%Y-%m-%d %H:%i:%s')", TilDato: "STR_TO_DATE('2019-11-14 15:00:00','%Y-%m-%d %H:%i:%s')", Ansvarlig: "'Jakup'" },
                { LokaleId: 6, FraDato: "STR_TO_DATE('2019-12-24 18:00:00','%Y-%m-%d %H:%i:%s')", TilDato: "STR_TO_DATE('2019-12-24 19:00:00','%Y-%m-%d %H:%i:%s')", Ansvarlig: "'Henrik'" },
                { LokaleId: 1, FraDato: "STR_TO_DATE('2019-11-25 11:30:00','%Y-%m-%d %H:%i:%s')", TilDato: "STR_TO_DATE('2019-11-25 12:00:00','%Y-%m-%d %H:%i:%s')", Ansvarlig: "'Ian'" },
                { LokaleId: 4, FraDato: "STR_TO_DATE('2020-07-06 13:30:00','%Y-%m-%d %H:%i:%s')", TilDato: "STR_TO_DATE('2020-07-06 14:00:00','%Y-%m-%d %H:%i:%s')", Ansvarlig: "'Julemand'" }
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

// ********************** Request/url Styringsmetode ******************
var handleRequest = (req, res, con) =>
{
    // ********************** Viser oversig over Lokaler ****************
    if (req.url.split("?")[0] == "/rooms")
        con.query("SELECT * FROM booking.rooms", function (err, data) {
            res.write(JSON.stringify(data, null, '\t'));
            res.end("\nRequest End!");
        });
    else
        if (req.url.split("?")[0] == "/booking") {
            // ****************** Booking view ***********************
            // booking uden parameter viser booking på dags dato.
            // booking?day=14 viser booking den 14. i samme måned.
            // booking?month=11 viser booking samme dag bare i november.  
            // booking?Year=2019 viser booking samme dag og samme måned i 2019.
            // booking?day=06&month=07&year=2020 viser booking den 06-07-2020.
            
            var get = "";
            var day = "";
            var month = "";
            var year = "";

            var date = new Date(Date.now());
            var today = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
            var showdate = "";

            if (req.url.indexOf("?") > 0) get = req.url.split("?")[1].split("&");

            if (get.length>0)
            {
                get.forEach(e => {
                    if (e.split("=")[0] == "day") day = e.split("=")[1];
                    if (e.split("=")[0] == "month") month = e.split("=")[1];
                    if (e.split("=")[0] == "year") year = e.split("=")[1];
                });

                showdate = "";
                if (year != "") showdate += year + "-"; else showdate += date.getFullYear() + "-";
                if (month != "") showdate += month + "-"; else showdate += (date.getMonth() + 1) + "-";
                if (day != "") showdate += day; else showdate += date.getDate();
            }
            else
                showdate = today;
                con.query("SELECT * FROM booking.reservation WHERE DATE(FraDato)>='" + showdate + "' AND DATE(TilDato)<='" + showdate + "'", function (err, data) {
                res.write(JSON.stringify(data, null, '\t'));
                res.end();
            });
            
        }
        else
            // ************************* Ved POST/bookning af lokale ***********************
            if (req.url.split("?")[0] == "/add")
            {
                bookLokale(req, res,con);
            }
            else
            {
                // ************************* Vis default index side ***********************
                if(serverPath="./") serverPath+="index.html";
                // get file and send to client
                fs.readFile(serverPath, function (err, data) {
                    // no file found send error to client
                    if (err != null) data = path.pathname + "\n404 Not Found";
                    res.setHeader("content-type","text/html");
                    res.end(data);
                });
            }
}

function bookLokale(req, res, con)
{
    var LokaleId = "";
    var FraDato = "";
    var TilDato = "";
    var FraTime = "";
    var TilTime = "";
    var Ansvarlig = "";

        if (getPostData.length>0)
        {
            // løb post elementer igennem og tildel værdier til variable
            getPostData.forEach(e => {
                if (e.split("=")[0] == "LokaleId") LokaleId = e.split("=")[1];
                if (e.split("=")[0] == "FraDato") FraDato = e.split("=")[1];
                if (e.split("=")[0] == "TilDato") TilDato = e.split("=")[1];
                if (e.split("=")[0] == "FraTime") FraTime = e.split("=")[1].replace("%3A", ":");
                if (e.split("=")[0] == "TilTime") TilTime = e.split("=")[1].replace("%3A", ":");
                if (e.split("=")[0] == "Ansvarlig") Ansvarlig = e.split("=")[1];
            });

            
            var fra = FraDato + " " + FraTime + ":00";
            var til = TilDato + " " + TilTime + ":00";
            
            var query = "SELECT * FROM booking.rooms WHERE PNR='" + LokaleId + "'";
            con.query(query, function (err, data)
            {
                if (data.length)
                {
                    query = "SELECT * FROM booking.reservation WHERE (";
                    query += "(FraDato<'" + fra + "' AND TilDato>'" + fra + "') OR ";
                    query += "(FraDato<'" + til + "' AND TilDato>'" + til + "') OR ";
                    query += "(FraDato='" + fra + "' AND TilDato='" + til + "') OR ";
                    query += "(FraDato>'" + fra + "' AND TilDato<'" + til + "')) AND ";
                    query += "LokaleId='" + LokaleId+"'";
                    con.query(query, function (err, data) {
                        // check om lokalet er booket
                        if (data.length > 0) {
                            data.unshift({ 'Booking Error': 1 });
                            res.end(JSON.stringify(data, null, '\t') + "\n");
                        }
                        else
                        {
                            // book lokalet
                            query = "INSERT INTO booking.reservation (LokaleId,FraDato,TilDato,Ansvarlig) VALUES('" + LokaleId + "','" + fra + "','" + til + "','" + Ansvarlig + "') ";
                            con.query(query, function (err, data) {
                                res.end('[{"Booking Ok!"}]');
                            });
                        }
                    });
                } else
                    res.end('[{"Room not found!"}]');
            });
            
        } else
            res.end('[{"Booking Error!"}]');
}

var server = http.createServer(function (req, res)
{
    path = url.parse(req.url, true);
    serverPath = "." + path.pathname;
    var query = path.query;

    // check om key er sat ved brug af api
    if (query["key"] || serverPath == "./" || serverPath=="./index.html")
    {
        if (query["key"] == validKeyCode || serverPath == "./" || serverPath == "./index.html")
        {
            // setup trigger hvis der bliver posted til serveren
            var data = "";
            req.on('data', function (incomingData) { data += incomingData; });
            req.on('end', function () { if (data != "") getPostData = data.split("&"); });

            sqlCon.checkForDb(req, res, testData, true, handleRequest); //  Brug/Opret database og test data 
        }
        else { res.end('[{"invalid key code!(Use key=123)"}]');} 
    }
    else
        res.end('[{"invalid key code!(Use key=123)"}]');
});
server.listen(8080);