# Endpoints
* POST /page-views/ - create an page-view event

All GET endpoints respond with 'Content-type':'application/json'. If no mathes found - respond with empty string
* GET /page-views/by-country/:country
* GET /page-views/by-browser/:browser 
* GET /page-views/by-user/:user-id
* GET /page-views/returning-users-rate

# Start:

Start mongodb in the docker container
```bash
docker pull mongo
docker run --name mongo-dev -d -p 3001:27017 mongo
```
Please note, 3001 port is written in config/db.js by default

Change config/db.js file to fit your db credentials (in this project mongodb was used)
```bash
npm install
npm start
```

# Testing:
```bash
npm test
```
