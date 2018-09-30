require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const axios = require('axios');
const bodyParser = require('body-parser')

const PETFINDER_KEY = process.env.PETFINDER_KEY;
const GEOCODE_KEY = process.env.GEOCODE_KEY;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'build')));

app.get('/api/pets', (req, res) => {
    axios.get(`https://api.petfinder.com/shelter.getPets?id=${req.query.shelterId}&key=${PETFINDER_KEY}&format=json`)
        .then(response=>{
            res.send(response.data.petfinder.pets.pet || []);
        })
        .catch(err=>{
            console.log(err);
        });
});

app.get('/api/shelters', (req, res) => {
    axios.get(`https://api.petfinder.com/shelter.find?location=${req.query.zip}&count=${req.query.count}&key=${PETFINDER_KEY}&format=json`)
        .then(response => {
            const shelters = response.data.petfinder.shelters.shelter;
            const geocodeShelters = shelters.map(shelter => {
                return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?key=${GEOCODE_KEY}&address=${shelter.address1.$t}, ${shelter.zip.$t}`)
                    .then((geocodeRes) => {
                        if (geocodeRes.data.results[0].geometry.location.lat && geocodeRes.data.results[0].geometry.location.lng) {
                            return {
                                lat: geocodeRes.data.results[0].geometry.location.lat,
                                lng: geocodeRes.data.results[0].geometry.location.lng
                            }
                        }
                    })
                    .catch(() => {
                        return {
                            lat: parseFloat(shelter.latitude.$t),
                            lng: parseFloat(shelter.longitude.$t)
                        }
                    })
            });

            Promise.all(geocodeShelters)
                .then(locations => {
                    res.send({
                        shelters,
                        locations
                    })
                });
        });
});

app.get('/api/location', (req, res) => {
    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?key=${GEOCODE_KEY}&address=${req.query.query}`)
        .then(response => { 
            res.send(response.data.results[0].geometry.location);
        })
        .catch(err => {
            console.log(err);
        })
});

app.get('/api/zip', (req, res) => {
    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?key=${GEOCODE_KEY}&latlng=${req.query.lat},${req.query.lng}`)
        .then(response => {
            res.send(response.data.results[0].address_components);
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