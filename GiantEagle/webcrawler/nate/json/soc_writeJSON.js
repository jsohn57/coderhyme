//phantom.casperPath = "/usr/local/casperjs";
//phantom.injectJs("/usr/local/casperjs/bin/bootstrap.js");

//var Iconv = require('iconv').Iconv;
//var iconv = new Iconv('UTF-8', 'EUC-KR//TRANSLIT//IGNORE');
var NUM_ARTICLES = 30;
var nCasperSports = require('casper').create({
	verbose: false,
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

var fs = require('fs');
var replyList = fs.list("/projects/GiantEagle/webcrawler/nate/wget_out/soc");
var stream, i, il;
stream = fs.open("/projects/GiantEagle/webcrawler/dat/nate/soc/article_url.in", 'r');
for(i = 0, il = NUM_ARTICLES; i < il; i++){
	articleURLList.push(stream.readLine());
}
stream.close();
stream = fs.open("/projects/GiantEagle/webcrawler/dat/nate/soc/title.in", 'r');
for(i = 0, il = NUM_ARTICLES; i < il; i++){
	titleList.push(stream.readLine());
}
stream.close();

replyList.sort(function(a,b){
	var dotIndex_a = a.indexOf('html');
	var dotIndex_b = b.indexOf('html');
	if(dotIndex_a < 0){
		return 10000;
	}
	if(dotIndex_b < 0){
		return 10000;
	}
	else{
		dotIndex_a--;
		dotIndex_b--;
		return (parseInt(a.substring(0, dotIndex_a)) - parseInt(b.substring(0, dotIndex_b)));
	}
});
articleURLList.sort(function(a,b){
	var delimIndex_a = a.indexOf(';');
	var nlIndex_a = a.indexOf('\n');
	var delimIndex_b = b.indexOf(';');
	var nlIndex_b = b.indexOf('\n');
	return (parseInt(a.substring(delimIndex_a+1, nlIndex_a)) - parseInt(b.substring(delimIndex_b+1, nlIndex_b)));	
});
titleList.sort(function(a,b){
	var delimIndex_a = a.indexOf(';');
	var nlIndex_a = a.indexOf('\n');
	var delimIndex_b = b.indexOf(';');
	var nlIndex_b = b.indexOf('\n');
	return (parseInt(a.substring(delimIndex_a+1, nlIndex_a)) - parseInt(b.substring(delimIndex_b+1, nlIndex_b)));	
});

try{
	var visited = 0;
	for(k = 0, kl = replyList.length; k < kl; k++){
		if(replyList[k].indexOf('html') >= 0){	
			visited++;
			if(visited == 1){
				nCasperSports.start("/projects/GiantEagle/webcrawler/nate/wget_out/soc/"+replyList[k]);
			}
			else{
				nCasperSports.thenOpen("/projects/GiantEagle/webcrawler/nate/wget_out/soc/"+replyList[k]);
			}
			nCasperSports.then(function(){
				var meta_ = {};
				meta_['article_url'] = "";
				meta_['title'] = "";
				meta_['best_replies'] = this.evaluate(function (){
					var i, il, j, jl;
					var replies = []; 
					var cmt_best = document.getElementsByClassName('cmt_best');
					if(cmt_best.length > 0){
						var children = cmt_best[0].childNodes;
						for(i = 0, il = children.length; i < il; i++){
							child = children[i];
							if(child.nodeName == 'DL'){
								var subChildren = child.childNodes;
								for(j = 0, jl = subChildren.length; j < jl; j++){
									var subChild = subChildren[j];
									if(subChild.className == 'usertxt'){
										replies.push(subChild.textContent);
									}
								}
							}
						}	
					}
					return replies;
				});
				completeList.push(meta_);
			});
		}
	}
}
catch(e){
	nCasperSports.echo("Error Occured!");	
}
finally{
	nCasperSports.run(function() {
		var i, il;	
		
		//this.echo("========================== replyList =============================\n");
		//require("utils").dump(replyList);
		
		//this.echo("========================== articleURLList =============================\n");
		//require("utils").dump(articleURLList);

		//this.echo("========================== titleList =============================\n");
		//require("utils").dump(titleList);

	
		for(i = 0, il = NUM_ARTICLES; i < il; i++){
			var delimIndex = articleURLList[i].indexOf(';');
			completeList[i]['article_url'] = articleURLList[i].substring(0, delimIndex);
		}
		for(i = 0, il = NUM_ARTICLES; i < il; i++){
			var delimIndex = titleList[i].indexOf(';');
			completeList[i]['title'] = "N " + titleList[i].substring(0, delimIndex);
		}

		//this.echo("========================== completeList =============================\n");
		//this.echo("Number of Elements : " + completeList.length);
		//require("utils").dump(completeList);
		if(fs.exists("/projects/GiantEagle/webcrawler/dat/crwl/nate_soc.crwl")){
			fs.remove("/projects/GiantEagle/webcrawler/dat/crwl/nate_soc.crwl");
		}
		fs.write("/projects/GiantEagle/webcrawler/dat/crwl/nate_soc.crwl", JSON.stringify({
			channel : 'nate_soc',
			at      : new Date(),
			data    : completeList
			}), 'w');

		this.echo("Done writing /projects/GiantEagle/webcrawler/dat/crwl/nate_soc.crwl");
		this.exit(0);
	});
}

