#!/bin/bash
	eval "rm -rf "/projects/GiantEagle/webcrawler/nate/wget_out/m_spo/*""
	eval "rm -rf "/projects/GiantEagle/webcrawler/nate/wget_out/m_ent/*""
	eval "rm -rf "/projects/GiantEagle/webcrawler/nate/wget_out/m_soc/*""
	eval "rm -rf "/projects/GiantEagle/webcrawler/nate/wget_out/m_pol/*""
	eval "rm -rf "/projects/GiantEagle/webcrawler/nate/wget_out/m_eco/*""
	fileName="/projects/GiantEagle/webcrawler/dat/nate/m_eco/article_url.in"
	count=0
	while read line
	do
		eval "wget --quiet --no-clobber --html-extension --domains nate.com --no-parent $line -O "/projects/GiantEagle/webcrawler/nate/wget_out/m_eco/$count.html""
		eval "sed -i 's:content=\"text\/html\; charset=euc-kr\":content=\"text\/html\; charset=cp949\":g' "/projects/GiantEagle/webcrawler/nate/wget_out/m_eco/$count.html""
		count=$(($count + 1))
	done < $fileName
	echo "done reading m_eco/article_url.in"
	
	fileName="/projects/GiantEagle/webcrawler/dat/nate/m_ent/article_url.in"
	count=0
	while read line
	do
		eval "wget --quiet --no-clobber --html-extension --domains nate.com --no-parent $line -O "/projects/GiantEagle/webcrawler/nate/wget_out/m_ent/$count.html""
		eval "sed -i 's:content=\"text\/html\; charset=euc-kr\":content=\"text\/html\; charset=cp949\":g' "/projects/GiantEagle/webcrawler/nate/wget_out/m_ent/$count.html""
		count=$(($count + 1))
	done < $fileName
	echo "done reading m_ent/article_url.in"
	
	fileName="/projects/GiantEagle/webcrawler/dat/nate/m_pol/article_url.in"
	count=0
	while read line
	do
		eval "wget --quiet --no-clobber --html-extension --domains nate.com --no-parent $line -O "/projects/GiantEagle/webcrawler/nate/wget_out/m_pol/$count.html""
		eval "sed -i 's:content=\"text\/html\; charset=euc-kr\":content=\"text\/html\; charset=cp949\":g' "/projects/GiantEagle/webcrawler/nate/wget_out/m_pol/$count.html""
		count=$(($count + 1))
	done < $fileName
	echo "done reading m_pol/article_url.in"

	fileName="/projects/GiantEagle/webcrawler/dat/nate/m_soc/article_url.in"
	count=0
	while read line
	do
		eval "wget --quiet --no-clobber --html-extension --domains nate.com --no-parent $line -O "/projects/GiantEagle/webcrawler/nate/wget_out/m_soc/$count.html""
		eval "sed -i 's:content=\"text\/html\; charset=euc-kr\":content=\"text\/html\; charset=cp949\":g' "/projects/GiantEagle/webcrawler/nate/wget_out/m_soc/$count.html""
		count=$(($count + 1))
	done < $fileName
	echo "done reading m_soc/article_url.in"

	fileName="/projects/GiantEagle/webcrawler/dat/nate/m_spo/article_url.in"
	count=0
	while read line
	do
		eval "wget --quiet --no-clobber --html-extension --domains nate.com --no-parent $line -O "/projects/GiantEagle/webcrawler/nate/wget_out/m_spo/$count.html""
		eval "sed -i 's:content=\"text\/html\; charset=euc-kr\":content=\"text\/html\; charset=cp949\":g' "/projects/GiantEagle/webcrawler/nate/wget_out/m_spo/$count.html""
		count=$(($count + 1))
	done < $fileName
	echo "done reading m_spo/article_url.in"

