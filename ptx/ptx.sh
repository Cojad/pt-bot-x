#!/bin/bash
pt_ver=1.2.6.12
ptx_ver=2.6
echo "Download ProfitTrailer v$pt_ver from github!"
wget https://github.com/taniman/profit-trailer/releases/download/v$pt_ver/ProfitTrailer.zip -O ProfitTrailer.zip
mkdir tmp
echo "Unzip ProfitTrailer.jar from ProfitTrailer.zip"
unzip -qo ProfitTrailer.zip -d tmp/
mv tmp/ProfitTrailer/ProfitTrailer.jar .
echo "Unzip static files from ProfitTrailer.jar"
unzip -q ProfitTrailer.jar -d tmp/
echo "move files to current folder"
rm -Rf static templates ptx index.php config.php
cp -r tmp/BOOT-INF/classes/static/* .
cp -r tmp/BOOT-INF/classes/templates .
touch css/xcustom.css
mv js/script.js js/scriptX.js
echo "remove temp files"
rm -Rf tmp ProfitTrailer.jar ProfitTrailer.zip
echo "Download PT Bot X from github"
wget https://github.com/Cojad/pt-bot-x/archive/v$ptx_ver.zip -O pt-box-x.zip
echo "Unzip pt-box-x.zip"
unzip pt-box-x.zip
echo "Move file to current dir"
cp -r pt-bot-x-$ptx_ver/* .
echo "remove temp files"
rm -Rf pt-bot-x-$ptx_ver pt-box-x.zip
echo "All done! Edit config.php to match your vps settings\n"