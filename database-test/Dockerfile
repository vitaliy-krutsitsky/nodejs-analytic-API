FROM mongo:latest

ADD pageViewsDb.json ./
CMD mongoimport --host localhost --db page-views --collection views --file ./pageViewsDb.json

EXPOSE 27017
CMD tail -f /dev/null