rm -rf dist/
mkdir dist
mkdir dist/intermediate
mkdir dist/intermediate/chrome
mkdir dist/intermediate/firefox
cp -r src/* dist/intermediate/chrome
cp -r src/* dist/intermediate/firefox
cp -r platform_specific/chrome/* dist/intermediate/chrome
cp -r platform_specific/firefox/* dist/intermediate/firefox
mkdir dist/firefox
mkdir dist/chrome
cd dist/intermediate/firefox
zip -r ../../firefox/firefox.zip *
cd ../chrome
zip -r ../../chrome/chrome.zip *