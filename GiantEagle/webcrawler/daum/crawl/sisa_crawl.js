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
}), pageInfo = [], urlList = [], replyList = [], ecoList = [], socList = [], polList = [];

try{
	dCasperSports.start("http://media.daum.net/netizen/popular/?include=society,politics,culture,economic,foreign,digital");
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
			}
			return pageInfo_;
		});
		return pageInfo;
	}, function then(){
			var i, il, replyInfo;
			for(i = 0, il = pageInfo.length; i < il; i++){
				this.thenOpen(pageInfo[i]['article_url'], function(){

					urlList.push(this.getCurrentUrl());
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
		var i, il;
		il = pageInfo.length;
		for(i = 0; i < il; i++){
			var meta = {};
			var urlString = urlList[i]; 
			meta['article_url'] = urlString;
			meta['title'] = "D " + pageInfo[i]['title'];
			meta['reply_url'] = replyList[i]['reply_url'];
			meta['best_replies'] = replyList[i]['best_replies'];
	
			if(urlString.search('politics') > -1){
				polList.push(meta);
			}
			else if(urlString.search('economic') > -1){
				ecoList.push(meta);
			}
			else if(urlString.search('society') > -1){
				socList.push(meta);
			}
		}
		
		//this.echo("========================== UrlList=============================\n");
		//this.echo("List Length = " + urlList.length);
		//require("utils").dump(urlList);
		//this.echo("========================== PoliticsList=============================\n");
		//this.echo("List Length = " + polList.length);
		//require("utils").dump(polList);
		//this.echo("========================== EconomicList=============================\n");
		//this.echo("List Length = " + ecoList.length);
		//require("utils").dump(ecoList);
		//this.echo("========================== SocietyList=============================\n");
		//this.echo("List Length = " + socList.length);
		//require("utils").dump(socList);
		
		var fs = require('fs');
		if(fs.exists("/projects/GiantEagle/webcrawler/dat/crwl/daum_pol.crwl")){
			fs.remove("/projects/GiantEagle/webcrawler/dat/crwl/daum_pol.crwl");
		}
		if(fs.exists("/projects/GiantEagle/webcrawler/dat/crwl/daum_eco.crwl")){
			fs.remove("/projects/GiantEagle/webcrawler/dat/crwl/daum_eco.crwl");
		}
		if(fs.exists("/projects/GiantEagle/webcrawler/dat/crwl/daum_soc.crwl")){
			fs.remove("/projects/GiantEagle/webcrawler/dat/crwl/daum_soc.crwl");
		}
		fs.write("/projects/GiantEagle/webcrawler/dat/crwl/daum_pol.crwl", JSON.stringify({
			channel : 'daum_pol',
			at      : new Date(),
			data    : polList
			}), 'w');
		fs.write("/projects/GiantEagle/webcrawler/dat/crwl/daum_eco.crwl", JSON.stringify({
			channel : 'daum_eco',
			at      : new Date(),
			data    : ecoList
			}), 'w');
		fs.write("/projects/GiantEagle/webcrawler/dat/crwl/daum_soc.crwl", JSON.stringify({
			channel : 'daum_soc',
			at      : new Date(),
			data    : socList
			}), 'w');

		this.echo("Done writing /projects/GiantEagle/webcrawler/dat/crwl/daum_pol.crwl");
		this.echo("Done writing /projects/GiantEagle/webcrawler/dat/crwl/daum_eco.crwl");
		this.echo("Done writing /projects/GiantEagle/webcrawler/dat/crwl/daum_soc.crwl");
		
		this.exit(0);
	});
}

