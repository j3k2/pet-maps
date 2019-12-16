require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const request = require('superagent');
const bodyParser = require('body-parser')

const PETFINDER_KEY = process.env.PETFINDER_KEY;

const PETFINDER_ID = process.env.PETFINDER_ID;
const PETFINDER_SECRET = process.env.PETFINDER_SECRET;
const GEOCODE_KEY = process.env.GEOCODE_KEY;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'build')));

app.get('/api/pets', (req, res) => {
  request.get(`https://api.petfinder.com/shelter.getPets?id=${req.query.shelterId}&key=${PETFINDER_KEY}&format=json`)
    .then(response => {
      res.send(response.body.petfinder.pets.pet || []);
    })
    .catch(err => {
      console.log(err);
    });
});

app.get('/api/shelters', async (req, res) => {
  const tokenResponse = await request.post('https://api.petfinder.com/v2/oauth2/token')
    .send({
      grant_type: 'client_credentials',
      client_id: PETFINDER_ID,
      client_secret: PETFINDER_SECRET
    });
  const token = tokenResponse.body.access_token;

  const sheltersResponse = await request.get('https://api.petfinder.com/v2/organizations')
    .query({
      location: `${req.query.lat}, ${req.query.lng}`,
      distance: 8,
      limit: 100
    })
    .set('Authorization', `Bearer ${token}`);

  const shelters = sheltersResponse.body.organizations ? sheltersResponse.body.organizations : [];

  const locations = await Promise.all(
    shelters.map(async shelter => {
      const response = await request.get(`https://maps.googleapis.com/maps/api/geocode/json`)
        .query({
          key: GEOCODE_KEY,
          address: shelter.address.address1 ? `${shelter.address.address1}, ${shelter.address.postcode}` : shelter.address.postcode
        })
        .catch(err=>{
          console.log(err);
        })
      if (response.body.results[0] && response.body.results[0].geometry.location.lat && response.body.results[0].geometry.location.lng) {
        return {
          lat: response.body.results[0].geometry.location.lat,
          lng: response.body.results[0].geometry.location.lng
        }
      } else {
        return {
          lat: null,
          lng: null
        }
      }
    })
  ).catch(err=>{
    console.log(err);
  })

  res.send({
    shelters,
    locations
  })
});

app.get('/api/location', (req, res) => {
  request.get(`https://maps.googleapis.com/maps/api/geocode/json?key=${GEOCODE_KEY}&address=${req.query.query}`)
    .then(response => {
      res.send(response.body.results[0] ? response.body.results[0].geometry.location : null);
    })
    .catch(err => {
      console.log(err);
    })
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);