
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
						console.log('turnscollection');
						cb();
					}
				});
			}, 
		
			function(cb) {

				db.collection('articles', function(err, collection) {
					if( err ) {
						console.log('no collections : articles')
					}
					else {
						Articles = collection;
						console.log('Article collection');
						cb();
					}
				});
			},

			function(cb) {

				return Turns.findOne( function(err, row) {
					
					var turnId = row.turn;


					// load *.crawl and save to db
					console.log('save to database ' + process.argv[2]);
		
					var filename     = process.argv[2];
					var fileContents = fs.readFileSync(filename, 'utf8'); 
					var json         = JSON.parse(fileContents); 	

					var data = json.data;
					console.log( data.length );

					(function(i) {
						if( i >= data.length ) return cb();

						var recursive = arguments.callee;
						var item = data[i];
						var row = { 
							turnId  : turnId,
							channel : json.channel,
							title: trim(item.title), 
							at: new Date(), 
							url: item.article_url,
							beples : item.best_replies
						};
					
						for( var k in row.beples ) 
							row.beples[k] = trim(row.beples[k]);
		
						Articles.insert(row, function(err, results) {
							//console.log( results );
							if( err ) return cb();
							return recursive(i+1);
						});

					})(0)
				});

			}
		], function(err, results) {

			if( err ) {
				console.log('cannot connect to db')
				return;
			} else {
				console.log('all collections are prepared');
			}

			db.close();
		});

	}
	var now = new Date();
	var hours = now.getHours();
	var minutes = now.getMinutes();
	var seconds = now.getSeconds();
	var monthnum = now.getMonth() + 1;
	var monthday = now.getDate();
	var year = now.getYear() + 1900;

	var timestr = " " + hours;
	timestr +=((minutes < 10)?":0":":") + minutes;
	timestr +=((seconds < 10)?":0":":") + seconds;

	var datestr = year;
	datestr += "/" + monthnum;
	datestr += ((monthday/10)?"/0":"/") + monthday;
	console.log("================== CRAWLING PROCESS FINISHED AT " + datestr + " " + timestr + " ==================");
});


