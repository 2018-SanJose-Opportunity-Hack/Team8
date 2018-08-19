#!/bin/sh
sudo apt-get update
sudo apt-get install git
git clone https://github.com/2018-SanJose-Opportunity-Hack/Team8.git
sudo apt-get install nodejs
sudo apt-get install npm
cd Team8
npm install
forever start index.js