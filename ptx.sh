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
echo "create config.php with PT Bot Url to $1"
echo -e "<?php \$url=\"$1\";?>\n" >> config.php;
echo "All done! you can now use PT Bot X by Cojad"