
/**
 * Module dependencies.
 */
var async = require('async');
var fs    = require('fs');
// global 
// connect to database
var mongo = require('mongodb'),
    Server = mongo.Server,
	  Db = mongo.Db;

var server  = new Server('localhost', 27017, {auto_reconnect: true});
var db      = new Db('GiantEagle', server);// Routes

function trim(s) {
	s += ''; // 숫자라도 문자열로 변환
	return s.replace(/^\s*|\s*$/g, '');
}

db.open(function(err, db) {

	if(!err) {
		console.log("Hello, mongo");

		async.series([
			
			function(cb) {

				db.collection('turns', function(err, turns) {
					if( err ) {
						console.log('no collections : turns')
					}
					else {
						Turns = turns;
						console.log('Article collection');
						cb();
					}
				});
			},
			function(cb) {
				Turns.remove( function(err) {
					console.log("DB has been cleared");
					cb();
				});
			}
		], function(err, results) {
			db.close();
		});

	}
});

