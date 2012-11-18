var dCasperSports = require('casper').create({
	clientScripts: [
		'/home/jsohn/coderhyme/coderhyme/GiantEagle/webcrawler/daum/include/jquery-1.8.1.min.js',
		'/home/jsohn/coderhyme/coderhyme/GiantEagle/webcrawler/daum/include/h.min.js'
	],
	verbose: true,
	logLevel:"debug",
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
	dCasperSports.start("http://m.sports.daum.net/sports/ranking/hotview/");
	dCasperSports.waitFor(function () {
		pageInfo = this.evaluate(function () {
			this.echo("hello");
			this.echo("olElem.length = " + document.getElementsByClassName('section_newsrank').length);
			var olElem = document.getElementsByClassName('list_newsitem')[0];
			var aElems = olElem.getElementsByClassName('link_tit');
			var i, il, pageInfo_ = [];
			
			var baseURL = "http://m.sports.daum.net"
			for(i = 0, il = aElems.length; i < il; i++){
				var leafNode = aElems[i];
				var txtElem = leafNode.getElementsByClassName('tit_news')[0];
				var meta = {};
				meta['article_url'] = baseURL + leafNode.getAttribute('href');
				meta['title'] = txtElem.textContent;
				pageInfo_.push(meta);
				if(pageInfo_.length == 30){
					return pageInfo_;
				}
			}
			return pageInfo_;
		});
		return pageInfo;
	}, function then(){
			var i, il;
			this.echo("pageInfo.length = " + pageInfo.length);
			for(i = 0, il = pageInfo.length; i < il; i++){
				this.thenOpen(pageInfo[i]['article_url'], function(){

					this.evaluate(function(){
						var scripts = document.getElementsByTagName('script');	
						var j, jl;
						for(j = 0, jl = scripts.length; j < jl; j++){
							this.echo(scripts[j]);
						}
					});
					/*
					var replyInfo = {}; 
					replyInfo['best_replies'] = this.evaluate(function() {
						var cmtBody = document.getElementsByClassName('cmt_body');
						var i, il, meta = [];
						for(i = 0, il = cmtBody.length; i < il; i++){
							var desc = cmtBody[i].getElementsByClassName('desc')[0];
							meta.push(desc.textContent);	
						}
						return meta;
					});
					replyList.push(replyInfo);
					*/
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
		this.echo("========================== ReplyList =============================\n");
		this.echo("List Length = " + replyList.length);
		require("utils").dump(replyList);
		this.echo("========================== PageInfo =============================\n");
		this.echo("List Length = " + pageInfo.length);
		require("utils").dump(pageInfo);

		var i, il;
		(pageInfo.length < 30)?(il = pageInfo.length):(il = 30);
		for(i = 0; i < il; i++){
			var meta = {}
			meta['article_url'] = pageInfo[i]['article_url'];
			meta['title'] = "D " + pageInfo[i]['title'];
			meta['best_replies'] = replyList[i]['best_replies'];
			completeList.push(meta);
		}
		
		this.echo("========================== CompleteList=============================\n");
		this.echo("List Length = " + completeList.length);
		require("utils").dump(completeList);
		
		/*
		var fs = require('fs');
		if(fs.exists("/projects/GiantEagle/webcrawler/dat/crwl/daum_spo.crwl")){
			fs.remove("/projects/GiantEagle/webcrawler/dat/crwl/daum_spo.crwl");
		}
		fs.write("/projects/GiantEagle/webcrawler/dat/crwl/daum_spo.crwl", JSON.stringify({
			channel : 'daum_spo',
			at      : new Date(),
			data    : completeList
			}), 'w');
		
		*/
		this.echo("Done writing /projects/GiantEagle/webcrawler/dat/crwl/daum_spo.crwl");
		
		this.exit(0);
	});
}

