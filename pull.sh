git stash
git pull
sudo rm -r -f node_modules
npm install --force
npm run build
pm2 restart disi-website
pm2 restart disi-api