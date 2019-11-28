var http = require("http");
var url = require("url");
var fs = require("fs");

var startPage = fs.readFileSync('index.html');

function handleCookies(req, res, handle)
{
	if (handle == "set" )
	{
		var cookie = { "some": "data" };
		res.writeHead(200, {'Set-Cookie': cookie, 'Content-Type': 'text/plain'});
		res.writeHead(301, { Location: req.headers.host });
		SendPage(res);
	}

	if (handle == "get" && req.headers.cookie)
	{
	}
}

function SendPage(res)
{
	res.setHeader("Content-Type", "text/html");
	res.end(startPage);
}

var server = http.createServer(function (req, res) {
	//var path = url.parse(req.url, true);
	//var serverPath = "." +path.pathname;
	//

		handleCookies(req, res, "set");
});

server.listen(8080);