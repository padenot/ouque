#!/bin/sh

if [ ! -d blog ]
then
  git clone git@github.com:padenot/blog.git
fi

cd blog
git pull origin master
hugo -d /var/www/blog -b https://blog.paul.cx --cleanDestinationDir
hugo -d /var/www/homepage/blogpreview --cleanDestinationDir --buildDrafts -F  -b "https://paul.cx/blogpreview/"
