#!/bin/bash

export PATH=$PATH:/usr/local/bin
TIME=`date`

echo "\n\n================== CRAWLING PROCESS STARTING AT $TIME =================="

NSRCS_CRWL=`ls /home/jsohn/coderhyme/coderhyme/GiantEagle/webcrawler/nate/crawl/*.js` 
NSRCS_WRITE=`ls /home/jsohn/coderhyme/coderhyme/GiantEagle/webcrawler/nate/json/*.js` 
DSRCS_CRWL_WRITE=`ls /home/jsohn/coderhyme/coderhyme/GiantEagle/webcrawler/daum/crawl/*.js`

for src in $NSRCS_CRWL
do
	eval "casperjs $src"
done

for src in $NSRCS_WRITE 
do	
	eval "casperjs $src"
done

for src in $DSRCS_CRWL_WRITE
do
	eval "casperjs $src" 
done

CRWLS=`find "/home/jsohn/coderhyme/coderhyme/GiantEagle/webcrawler/m_dat" -name "*.crwl"`

eval "node /projects/GiantEagle/webcrawler/turn.js"

for crwl in $CRWLS
do
	eval "node /projects/GiantEagle/webcrawler/save.js $crwl"
done


