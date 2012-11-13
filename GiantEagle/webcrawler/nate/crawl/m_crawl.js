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
}), topLinks = [], replyUrlList = {}; 

var sectionList = ['spo', 'ent', 'pol', 'soc', 'eco'];
var NUM_ARTICLES = 30;

try{
	nCasperSports.start("http://m.news.nate.com/rank");
	nCasperSports.waitFor( function (){
		return topLinks = this.evaluate(function () { 
			var divElem = document.getElementsByClassName('ranking_line')[0];
			var i, il, j, jl, k, kl; 
			var topLinks_ = [];
			var divChildren = divElem.childNodes;
			for(i = 0, il = divChildren.length; i < il; i++){
				var divChild = divChildren[i];
				if(divChild.nodeName == 'UL'){
					var listNodes = divChild.childNodes;
					var sectToLink = {};
					for(j = 0, jl = listNodes.length; j < jl; j++){
						if(listNodes[j].nodeName == 'LI'){
							var sectionAnchor = listNodes[j].firstChild;
							var bool = false;
							switch(sectionAnchor.textContent){
								case '스포츠':	
									sectToLink['spo'] = sectionAnchor.getAttribute('href');
									bool = true;
									break;
								case '연예':
									sectToLink['ent'] = sectionAnchor.getAttribute('href');
									bool = true;
									break;
								case '정치':
									sectToLink['pol'] = sectionAnchor.getAttribute('href');
									bool = true;
									break;
								case '사회':
									sectToLink['soc'] = sectionAnchor.getAttribute('href');
									bool = true;
									break;
								case '경제':
									sectToLink['eco'] = sectionAnchor.getAttribute('href');
									bool = true;
									break;
								default:
									bool = false;
									break;
							}
						}
					}
					topLinks_.push(sectToLink);
				}
			}
			return topLinks_;
		});
	}, function then(){ 
		var i, il, section;
		this.each(sectionList, function(self, section){
			console.log("section = " + section);
			this.thenOpen(topLinks[0][section], function(){
				this.then(function(){
					var articleElems = [];
					var i, il;
					replyUrlList[section] = this.evaluate(function() {
						var replyUrlList_ = [];
						var i, il;
						var ULElem = document.getElementsByClassName('news_list')[0];
						var LIElems = ULElem.getElementsByTagName('LI');
						for(i = 0, il = 30; i < il; i++){
							var meta = {};
							var liElem = LIElems[i];
							var onClick = liElem.getAttribute('onclick');
							var startIdx = onClick.indexOf('(\'');
							var endIdx = onClick.indexOf('\')');
							var url = onClick.slice(startIdx+2, endIdx);
							var DLElem = liElem.getElementsByTagName('DL')[0];
							var DTElem = DLElem.getElementsByTagName('DT')[0];
							var data = DTElem.childNodes[1].data;
							meta['article_url'] = url;
							meta['title'] = data;
							replyUrlList_.push(meta);
						}
						return replyUrlList_;
					});
				
				});
			});
		});
		return;
	});
}
catch(e){
	nCasperSports.echo("Error Occured!");	
}
finally{
	nCasperSports.run(function() {
		var i, il;	
		var fs = require('fs');
		this.each(sectionList, function(self, section){
			console.log(section);
			if(fs.exists("/projects/GiantEagle/webcrawler/dat/nate/m_" + section + "/article_url.in")){
				fs.remove("/projects/GiantEagle/webcrawler/dat/nate/m_" + section + "/article_url.in");
			}	
			var articleStream = fs.open("/projects/GiantEagle/webcrawler/dat/nate/m_" + section + "/article_url.in", 'w');
			var titleStream = fs.open("/projects/GiantEagle/webcrawler/dat/nate/m_" + section + "/title.in", 'w');	
			for(i = 0, il = replyUrlList[section].length; i < il; i++){
				articleStream.write('\"' + replyUrlList[section][i]['article_url'] + '\"\n');
				console.log(replyUrlList[section][i]['article_url'] + '\n');
				titleStream.write(replyUrlList[section][i]['title'] + '\n');
				console.log(replyUrlList[section][i]['title'] + '\n');
			}
			articleStream.close(); titleStream.close();
		});

		this.exit(0);
	});
}

