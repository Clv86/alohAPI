# AlohAPI - weather API dedicated to surf conditions for Aloha website

The goal of this API is to manage data for the Aloha surf website (https://aloha-surf.vercel.app/).

This API solves two issues :

-   While Aloha only uses data from Open-Meteo for now, the number of free requests to their database is limited. AlohAPI will be used to fetch data several times a day and to stock them so there will be an unlimited number of requests for the client side of the website since they will be on our database.
-   The long term goal of Aloha is to cross-referenced several weather databases. The API will be used to facilitate the data management and the calculation between databases.

For this project, I've chosen a Javascript stack with Node JS and Express JS for their ease to use, and since the project only need a simple REST API. Mongoo DB was the database of choice for its collection model. I also used Axios to fetch other APIs since it appears to be a more secure and cleaner way than the HTTP method.

The API has 3 routes. The first one with the spots coordinates manages which spots are concerned by the database. The two other ones are dayConditions (to manage conditions by hours) and weekConditions (to manage conditions by days). They have a main function which is to erase all the previous datas and get all the last weather conditions for every spots available. Their other functions are used by the client to fetch either all the conditions, either one specific spot condition.

## Setup

-   Install all the requirements using npm :

### `npm install`

-   Create your environment file ('.env') including your mongoDB string as :

### `URL='mongodb+srv://myDatabaseUser:D1fficultP%40ssw0rd@mongodb0.example.com/?authSource=admin&replicaSet=myRepl'`

-   Run the API :

### `nodemon server.js`

## Docker version

This project can also be deploy with Docker in order to facilitate testing and the implementation of further upgrades in the same environment. you can build the docker image of the project with :

### `docker build -t image-name`

## List of requests

### Spots

-   GET '/spots/' : get you all the spots coordinates
-   GET '/spots/:name' : get you one specific spot coordinates
-   POST '/spots/add' : add spots coordinates
-   DELETE '/spots/:id' : delete one specific spot coordinates
-   MODIFY '/spots/:id' : modify one specific spot coordinates or name

### Day Conditions

-   GET '/dayConditions/' : get you all the spots day conditions
-   GET '/dayConditions/:name' : get you one spot day conditions
-   POST '/dayConditions/' : Erase every day condition and fetch day conditions for every spot available in the database
-   DELETE '/dayConditions/' : delete every day conditions

### Week Conditions

-   GET '/weekConditions/' : get you all the spots week conditions
-   GET '/weekConditions/:name' : get you one spot week conditions
-   POST '/weekConditions/' : Erase every week condition and fetch week conditions for every spot available in the database
-   DELETE '/weekConditions/' : delete every week condition
