sudo git stash
sudo git pull
sudo rm -r -f node_modules
sudo npm install --force
sudo npm run build
pm2 restart disi-website
pm2 restart disi-api