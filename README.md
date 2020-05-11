# Pet Maps

A map-based view for Petfinder.com data. Deployed on https://pet-maps.herokuapp.com

To start application on development server:
1. `npm install` to install dependencies
2. `npm run dev` to run client application on localhost:3000. Requires a Google API key as environment variable `REACT_APP_MAPS_KEY`. In production, this should be a restricted key suitable for client requests.
3. `npm run server` to run required server for API requests on localhost:5000. Requires a Google API key as environment variable `GEOCODE_KEY` and Petfinder.com API ID/Secret as environment variables `PETFINDER_ID` and `PETFINDER_SECRET`.

In production, client app will be built with `npm run build`, and both client and API will be served together with `npm run start`