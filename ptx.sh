#!/bin/bash
#curl -sLO https://ass.tw/ptx.sh;
#bash ptx.sh "http://127.0.0.1:8080"
echo "Donload ProfitTrailer v1.2.6.11 from github!"
wget https://github.com/taniman/profit-trailer/releases/download/v1.2.6.11/ProfitTrailer.zip -O ProfitTrailer.zip
mkdir tmp
echo "Unzip ProfitTrailer.jar from ProfitTrailer.zip"
unzip -qoj ProfitTrailer.zip ProfitTrailer/ProfitTrailer.jar
echo "Unzip static files from ProfitTrailer.jar"
unzip -q ProfitTrailer.jar -d tmp/
echo "move files to current folder"
cp -ruv tmp/BOOT-INF/classes/static/* .
cp -ruv tmp/BOOT-INF/classes/templates  templates
touch css/xcustom.css
rm js/script.js
echo "remove temp files"
rm -Rf tmp ProfitTrailer.jar
echo "Download PT Bot X from github"
wget https://github.com/Cojad/pt-bot-x/archive/v2.0.zip -O pt-box-x.zip
echo "Unzip pt-box-x.zip"
unzip pt-box-x.zip
echo "Move file to current dir"
cp -R pt-bot-x-2.0/* .
echo "remove temp files"
rm -Rf pt-bot-x-2.0
echo "create config.php with PT Bot Url to $1"
echo -e "<?php \$url=\"$1\";?>" >> config.php;
echo "All done! you can now use PT Bot X by Cojad"