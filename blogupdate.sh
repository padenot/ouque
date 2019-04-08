#!/bin/sh

if [ ! -d blog ]
then
  git clone git@github.com:padenot/blog.git
fi

cd blog
git pull origin master
hugo
cp -r public/* /var/www/blog/
