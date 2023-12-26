git stash
git pull
rm -r -f node_modules
npm install
npm run build
pm2 restart disi-website
pm2 restart disi-api