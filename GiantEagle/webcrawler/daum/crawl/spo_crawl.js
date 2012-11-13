//phantom.casperPath = "/usr/local/casperjs";
//phantom.injectJs("/usr/local/casperjs/bin/bootstrap.js");

//var Iconv = require('iconv').Iconv;
//var iconv = new Iconv('UTF-8', 'EUC-KR//TRANSLIT//IGNORE');
var dCasperSports = require('casper').create({
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
}), pageInfo = [], replyList = [], completeList = [];

try{
	dCasperSports.start("http://media.daum.net/netizen/popular/?include=sports");
	dCasperSports.waitFor(function () {
		pageInfo = this.evaluate(function () {
			var elems = document.getElementsByClassName('link_txt'),
			i, il, pageInfo_ = [];
			
			var baseURL = "http://media.daum.net"
			for(i = 0, il = elems.length; i < il; i++){
				var leafNode = elems[i]
				if(leafNode.parentNode.parentNode.getAttribute('class') == "cont"){
					var meta = {};
					meta['article_url'] = baseURL + leafNode.getAttribute('href');
					meta['title'] = leafNode.getAttribute('title');
					pageInfo_.push(meta);
				}
				if(pageInfo_.length == 30){
					return pageInfo_;
				}
			}
			return pageInfo_;
		});
		return pageInfo;
	}, function then(){
			var i, il, replyInfo;
			for(i = 0, il = pageInfo.length; i < il; i++){
				this.thenOpen(pageInfo[i]['article_url'], function(){
					this.then(function() {
						this.click('A.a2');
						this.then(function() {
							this.open(this.getCurrentUrl()).then(function () {
								var replyInfo = {};
								replyInfo['reply_url'] = this.getCurrentUrl();
								replyInfo['best_replies'] = this.evaluate(function () {
									var elems = document.getElementsByClassName('content');
									var i, il;
									(elems.length < 3)?(il = elems.length):(il = 3);
									var meta = [];
									for(i = 0; i < il; i++){
										meta.push(elems[i].textContent);	
									} 
									return meta;
								});
								replyList.push(replyInfo);
							});
						});	
					});
				});
			}
			return replyList;
		}
	);
}
catch(e){
	dCasperSports.echo("Error Occured!");
}
finally{
	dCasperSports.run(function () {
		//this.echo("========================== ReplyList =============================\n");
		//this.echo("List Length = " + replyList.length);
		//require("utils").dump(replyList);
		//this.echo("========================== PageInfo =============================\n");
		//this.echo("List Length = " + pageInfo.length);
		//require("utils").dump(pageInfo);


		var i, il;
		(pageInfo.length < 30)?(il = pageInfo.length):(il = 30);
		for(i = 0; i < il; i++){
			var meta = {}
			meta['article_url'] = pageInfo[i]['article_url'];
			meta['title'] = "D " + pageInfo[i]['title'];
			meta['reply_url'] = replyList[i]['reply_url'];
			meta['best_replies'] = replyList[i]['best_replies'];
			completeList.push(meta);
		}
		
		//this.echo("========================== CompleteList=============================\n");
		//this.echo("List Length = " + completeList.length);
		//require("utils").dump(completeList);
		
		var fs = require('fs');
		if(fs.exists("/projects/GiantEagle/webcrawler/dat/crwl/daum_spo.crwl")){
			fs.remove("/projects/GiantEagle/webcrawler/dat/crwl/daum_spo.crwl");
		}
		fs.write("/projects/GiantEagle/webcrawler/dat/crwl/daum_spo.crwl", JSON.stringify({
			channel : 'daum_spo',
			at      : new Date(),
			data    : completeList
			}), 'w');

		this.echo("Done writing /projects/GiantEagle/webcrawler/dat/crwl/daum_spo.crwl");
		
		this.exit(0);
	});
}

