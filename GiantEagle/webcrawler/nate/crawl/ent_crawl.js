//phantom.casperPath = "/usr/local/casperjs";
//phantom.injectJs("/usr/local/casperjs/bin/bootstrap.js");

//var Iconv = require('iconv').Iconv;
//var iconv = new Iconv('UTF-8', 'EUC-KR//TRANSLIT//IGNORE');
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
}), pageInfo = [], replyUrlList = []; 

try{
	nCasperSports.start("http://news.nate.com/rank/interest?sc=ent");
	nCasperSports.waitFor( function (){
		var i,l;
		pageInfo = this.evaluate(function () {
			var elems = document.getElementsByClassName('mduSubjectContent'),
			pageInfo_ = [],		
			subChild,
			subChildren,
			children,
			child,
			i,il,
			j, jl,
			k, kl;
				
			for(i = 0, il = elems.length; i < il; i++){
				children = elems[i].childNodes;
				for(j = 0, jl = children.length; j < jl; j++){
					child = children[j];
					if(child.nodeName == 'DT'){
						subChildren = child.childNodes;
						for(k = 0, kl = subChildren.length; k < kl; k++){
							subChild = subChildren[k];
							if(subChild.nodeName == 'A'){
								var meta_ = {};		
								meta_['article_url'] = subChild.getAttribute('href'); 
								meta_['title'] = subChild.getAttribute('title');
								pageInfo_.push(meta_);
							}
						}
					}
				}
			}
			elems = document.getElementsByClassName('mduSubject');
			for(i = 0, il = elems.length; i < il; i++){
				children = elems[i].childNodes;
				for(j = 0, jl = children.length; j < jl; j++){
					child = children[j];
					if(child.nodeName == 'LI'){
						subChildren = child.childNodes;
						for(k = 0, kl = subChildren.length; k < kl; k++){
							subChild = subChildren[k];
							if(subChild.nodeName == 'A'){
								var meta_ = {};		
								meta_['article_url'] = subChild.getAttribute('href');
								meta_['title'] = subChild.getAttribute('title');	
								pageInfo_.push(meta_);
							}
						}
					} 
				}
			}
			
			return pageInfo_;
		});
		return pageInfo;
	}, function then(){
			this.each(pageInfo, function (self, meta){
				this.thenOpen(meta['article_url'], function (){
					var meta_ = {};	
					meta_['article_url'] = meta['article_url'];
					meta_['title'] = meta['title'];	
					meta_['reply_url'] = this.evaluate(function (){
						return document.getElementById('ifr_reple').getAttribute('src');
					});
					replyUrlList.push(meta_);
				});
			});
			return replyUrlList;
		}
	);
}
catch(e){
	nCasperSports.echo("Error Occured!");	
}
finally{
	nCasperSports.run(function() {
		
		//this.echo("========================== PageInfo =============================\n");
		//require("utils").dump(pageInfo);

		//this.echo("========================== replyUrlList =============================\n");
		//require("utils").dump(replyUrlList);

		var i, il;
		var fs = require('fs');	
		if(fs.exists("/projects/GiantEagle/webcrawler/dat/nate/ent/article_url.in")){
			fs.remove("/projects/GiantEagle/webcrawler/dat/nate/ent/article_url.in");
		}	
		if(fs.exists("/projects/GiantEagle/webcrawler/dat/nate/ent/reply_url.in")){
			fs.remove("/projects/GiantEagle/webcrawler/dat/nate/ent/reply_url.in");
		}
		if(fs.exists("/projects/GiantEagle/webcrawler/dat/nate/ent/title.in")){
			fs.remove("/projects/GiantEagle/webcrawler/dat/nate/ent/title.in");
		}	

		var articleStream = fs.open("/projects/GiantEagle/webcrawler/dat/nate/ent/article_url.in", 'w');
		var replyStream = fs.open("/projects/GiantEagle/webcrawler/dat/nate/ent/reply_url.in", 'w');
		var titleStream = fs.open("/projects/GiantEagle/webcrawler/dat/nate/ent/title.in", 'w');	
		for(i = 0, il = replyUrlList.length; i < il; i++){
			articleStream.write(replyUrlList[i]['article_url'] + ';' + i + '\n');
			replyStream.write('\"' + replyUrlList[i]['reply_url'] + '\"' + ';' + i + '\n');
			titleStream.write(replyUrlList[i]['title'] + ';' + i + '\n');
		}
				
		this.echo("File WRITE Finished\n");
		
		articleStream.close(); replyStream.close(); titleStream.close();
		this.exit(0);
	});
}

