var http = require("http");
var url = require("url");

var htmlHead ='<head><meta charset="utf-8" /><title>Cookies test</title></head><body> <h1>Cookies Check</h1> <a href="index.html?set=1">Set Cookie</a> <br><a href="index.html?read=1">Get Cookie</a><br><a href="index.html?array=1">Make Cookie into array</a><br><a href="index.html?dictionary=1">Make Cookie into dictonary</a><br><a href="index.html?delete=1">Delete all active cookies</a><br>';
var htmlFoot = '</body></html>';
var startPage = htmlHead + htmlFoot;

function handleCookies(req, res, handle)
{
    // ********* Sætter Cookies ****************
    if (handle == "set") {

        var date = new Date();
        date.setDate(new Date(new Date()).getDate() + 1); // add one day to current day
        var cookies = [ "c1=hej;Max-Age=30;HttpOnly",
                        "c2=med;Expires=" + date.toUTCString(),
                        "c3=dig;Max-Age=36;SameSite=Strict"];
        res.writeHead(302, { 'Set-Cookie': cookies});
        SendPage(res, cookies);
	}

    // ********* Returner Alle Cookies ****************
	if (handle == "read")
    {
        if (req.headers.cookie) SendPage(res, req.headers.cookie);
        else
            SendPage(res, "No Cookies");
    }

    // ********* Returner et object ****************
    if (handle == "array" || handle == "dictionary")
    {
        if (req.headers.cookie) SendPage(res, JSON.stringify(makeCookieObject(req, handle), null, "\t"));
        else
            SendPage(res, "No Cookies");
    }
    // ********* Sletter alle aktive Cookies ****************
    if (handle == "delete")
    {
        var cookieObject = makeCookieObject(req, "array");
        var cookies = [];
        var date = new Date();
        cookieObject.forEach((item, index) =>
        {
            var elements = item.split("=");
            cookies.push(elements[0]+"=a" + ";Expires=" + date.toUTCString());
        });
        if (cookies.length > 0)
        { 
            res.writeHead(302, { 'Set-Cookie': cookies });
        }
        SendPage(res, "All cookies deleted!");
    }
}

// sender respons til klient
function SendPage(res,value)
{
    startPage = htmlHead + "<h2> Cookie View </h2>" + value + htmlFoot;
	res.end(startPage);
}

// laver et object og returnere den type man ønsker (array eller dictonary)
function makeCookieObject(req,type)
{
    var cookiesstring = req.headers.cookie;
    if (req.headers.cookie) {
        var cookiesarray = req.headers.cookie.split(";");
        var cookiesDict = {};
        if (type == "array")
            return cookiesarray;
        else {
            // lav et dictonary
            cookiesarray.forEach((item, index) => {
                var elements = item.split(";");
                elements.forEach((item, index) => {
                    cookiesDict[item.split("=")[0]] = item.split("=")[1];
                });
            });
            return cookiesDict;
        }
    } else return [];
}

var server = http.createServer(function (req, res) {
    var path = url.parse(req.url, true);
    var query = path.query;

    if (query["set"]) handleCookies(req, res, "set"); else
        if (query["read"]) handleCookies(req, res, "read"); else
            if (query["array"]) handleCookies(req, res, "array"); else
                if (query["dictionary"]) handleCookies(req, res, "dictionary"); else
                    if (query["delete"]) handleCookies(req, res, "delete"); else
        { res.setHeader("Content-Type", "text/html"); SendPage(res,""); }
});

server.listen(8080);