var nCasperSports = require('casper').create({
	verbose: true,
	logLevel: "debug",
	onError: function(self, m){
		console.log('FATAL:' + m);
		self.exit();
	},
	pageSettings: {
		javascriptEnabled: true,
		loadImages: false,
		loadPlugins: false
	}
}), completeList = [], articleURLList = [], titleList = [];

var NUM_ARTICLES = 30;
var fs = require('fs');
var stream, i, il;
stream = fs.open("/home/jsohn/coderhyme/coderhyme/GiantEagle/webcrawler/dat/nate/m_spo/article_url.in", 'r');
for(i = 0, il = NUM_ARTICLES; i < il; i++){
	articleURLList.push(stream.readLine());
}
stream.close();
stream = fs.open("/home/jsohn/coderhyme/coderhyme/GiantEagle/webcrawler/dat/nate/m_spo/title.in", 'r');
for(i = 0, il = NUM_ARTICLES; i < il; i++){
	titleList.push(stream.readLine());
}
stream.close();

try{
	var visited = 0;
	nCasperSports.each(articleURLList, function(self, reply){
		visited++;
		if(visited == 1){
			this.start(reply);
		}
		else{
			this.thenOpen(reply);
		}
		this.then(function(){
			var meta_ = {};
			meta_['article_url'] = "";
			meta_['title'] = "";
			meta_['best_replies'] = this.evaluate(function (){
				var i, il;
				var replies = []; 
				var cmt_bests = document.getElementsByClassName('userText');
				for(i = 0, il = cmt_bests.length; i < il; i++){
					replies.push(cmt_bests[i].textContent);
				}
				return replies;
			});
			completeList.push(meta_);
		});
	});
}
catch(e){
	nCasperSports.echo("Error Occured!");	
}
finally{
	nCasperSports.run(function() {
		var i, il;	
		
		this.echo("========================== replyList =============================\n");
			
		for(i = 0, il = NUM_ARTICLES; i < il; i++){
			completeList[i]['article_url'] = articleURLList[i];
		}
		for(i = 0, il = NUM_ARTICLES; i < il; i++){
			completeList[i]['title'] = "N " + titleList[i];
		}
		
		this.echo("========================== articleURLList =============================\n");
		require("utils").dump(articleURLList);

		this.echo("========================== titleList =============================\n");
		require("utils").dump(titleList);


		this.echo("========================== completeList =============================\n");
		this.echo("Number of Elements : " + completeList.length);
		require("utils").dump(completeList);
		if(fs.exists("/home/jsohn/coderhyme/coderhyme/GiantEagle/webcrawler/tmp_dat/crwl/m_nate_spo.crwl")){
			fs.remove("/home/jsohn/coderhyme/coderhyme/GiantEagle/webcrawler/tmp_dat/crwl/m_nate_spo.crwl");
		}	

		fs.write("/home/jsohn/coderhyme/coderhyme/GiantEagle/webcrawler/tmp_dat/crwl/m_nate_spo.crwl", JSON.stringify({
			channel : 'nate_spo',
			at      : new Date(),
			data    : completeList
			}), 'w');

		this.echo("Done writing /home/jsohn/coderhyme/coderhyme/GiantEagle/webcrawler/tmp_dat/crwl/m_nate_spo.crwl");
		this.exit(0);
	});
}

