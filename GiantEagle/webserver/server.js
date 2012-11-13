var http = require('http');
var Buffer = require('buffer').Buffer;
var Iconv  = require('iconv').Iconv;
var assert = require('assert');

var iconv = new Iconv('utf-8', 'ascii');
http.createServer(function (req, res){
	console.log("[200] " + req.method + " to " + req.url);
	switch(req.url){
		case '/data':
			if(req.method == 'POST'){
				req.on('data', function(chunk){
					console.log("\nReceived body data:\n");
					console.log(chunk.toString());
					console.log("\nTranslated body data:\n");
					console.log(iconv.convert(chunk).toString());
					//console.log(chunk.toString().toCharset('CP949'));
				});
				
				req.on('end', function() {
					res.writeHead(200, "OK", {'Content-Type': 'text/html'});
					res.end();
				});
			}
			break;
		default:
			res.writeHead(404, "Not found", {'Content-Type': 'text/html'});
			res.end("<html><head><title>404 - Not Found</title></head><body><h1>Not Found.</h1></body></html>");	
			console.log("[404] " + req.method + " to " + req.url);
	};

}).listen(1337, "115.68.24.183");

console.log("Server running at http://115.68.24.183:1337/");
