#!/bin/bash
	eval "rm -rf "/projects/GiantEagle/webcrawler/nate/wget_out/spo/*""
	eval "rm -rf "/projects/GiantEagle/webcrawler/nate/wget_out/ent/*""
	eval "rm -rf "/projects/GiantEagle/webcrawler/nate/wget_out/soc/*""
	eval "rm -rf "/projects/GiantEagle/webcrawler/nate/wget_out/pol/*""
	eval "rm -rf "/projects/GiantEagle/webcrawler/nate/wget_out/eco/*""
	fileName="/projects/GiantEagle/webcrawler/dat/nate/spo/reply_url.in"
	while read line
	do
		set -- $line
		IFS=";"; declare -a tokens=($*)
		eval "wget --quiet --no-clobber --html-extension --domains nate.com --no-parent ${tokens[0]} -O "/projects/GiantEagle/webcrawler/nate/wget_out/spo/${tokens[1]}.html""
		eval "sed -i 's:content=\"text\/html\; charset=euc-kr\":content=\"text\/html\; charset=cp949\":g' "/projects/GiantEagle/webcrawler/nate/wget_out/spo/${tokens[1]}.html""
	done < $fileName
	echo "done reading spo/reply_url.in"
	
	fileName="/projects/GiantEagle/webcrawler/dat/nate/ent/reply_url.in"
	while read line
	do
		set -- $line
		IFS=";"; declare -a tokens=($*)
		eval "wget --quiet --no-clobber --html-extension --domains nate.com --no-parent ${tokens[0]} -O "/projects/GiantEagle/webcrawler/nate/wget_out/ent/${tokens[1]}.html""
		eval "sed -i 's:content=\"text\/html\; charset=euc-kr\":content=\"text\/html\; charset=cp949\":g' "/projects/GiantEagle/webcrawler/nate/wget_out/ent/${tokens[1]}.html""
	done < $fileName
	echo "done reading ent/reply_url.in"

	fileName="/projects/GiantEagle/webcrawler/dat/nate/soc/reply_url.in"
	while read line
	do
		set -- $line
		IFS=";"; declare -a tokens=($*)
		eval "wget --quiet --no-clobber --html-extension --domains nate.com --no-parent ${tokens[0]} -O "/projects/GiantEagle/webcrawler/nate/wget_out/soc/${tokens[1]}.html""
		eval "sed -i 's:content=\"text\/html\; charset=euc-kr\":content=\"text\/html\; charset=cp949\":g' "/projects/GiantEagle/webcrawler/nate/wget_out/soc/${tokens[1]}.html""
	done < $fileName
	echo "done reading soc/reply_url.in"
	fileName="/projects/GiantEagle/webcrawler/dat/nate/pol/reply_url.in"
	while read line
	do
		set -- $line
		IFS=";"; declare -a tokens=($*)
		eval "wget --quiet --no-clobber --html-extension --domains nate.com --no-parent ${tokens[0]} -O "/projects/GiantEagle/webcrawler/nate/wget_out/pol/${tokens[1]}.html""
		eval "sed -i 's:content=\"text\/html\; charset=euc-kr\":content=\"text\/html\; charset=cp949\":g' "/projects/GiantEagle/webcrawler/nate/wget_out/pol/${tokens[1]}.html""
	done < $fileName
	echo "done reading pol/reply_url.in"
	fileName="/projects/GiantEagle/webcrawler/dat/nate/eco/reply_url.in"
	while read line
	do
		set -- $line
		IFS=";"; declare -a tokens=($*)
		eval "wget --quiet --no-clobber --html-extension --domains nate.com --no-parent ${tokens[0]} -O "/projects/GiantEagle/webcrawler/nate/wget_out/eco/${tokens[1]}.html""
		eval "sed -i 's:content=\"text\/html\; charset=euc-kr\":content=\"text\/html\; charset=cp949\":g' "/projects/GiantEagle/webcrawler/nate/wget_out/eco/${tokens[1]}.html""
	done < $fileName
	echo "done reading eco/reply_url.in"

