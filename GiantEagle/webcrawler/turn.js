
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
				Turns.findOne( function(err, row) {
					console.log("Show turn: " + JSON.stringify(row));
					
					if( !row ) {
						Turns.insert({ turn: 1 });
					} else {
						Turns.update({}, { $inc : { turn: 1 }});
					}

					cb();

				});
			}
		], function(err, results) {
			db.close();
		});

	}
});

