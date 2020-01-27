FROM mongo:latest

ADD pageViewsDb.json ./
CMD mongoimport --host localhost --db events --collection page-views --file ./pageViewsDb.json

EXPOSE 27017
CMD tail -f /dev/null