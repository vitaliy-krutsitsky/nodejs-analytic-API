# Endpoints
* POST /page-views/ - create an page-view event

All GET endpoints respond with 'Content-type':'application/json'. If no mathes found - respond with empty string
* GET /page-views/by-country/<country>
* GET /page-views/by-browser/<browser> 
* GET /page-views/by-user/<user-id> 

# Start:
Change config/db.js file to fit your db credentials (in this project mongodb was used)
```bash
npm install
npm start
```

# Testing:
```bash
npm test
```
