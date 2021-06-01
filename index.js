const morgan = require('morgan');
const mongoose = require('mongoose');
const logger = require('./middleware/logger');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const home = require('./routes/home');
const Joi = require('joi');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// create application/json parser
var jsonParser = express.json();
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = express.urlencoded({ extended: false });

mongoose.connect('mongodb://localhost/vidly',{ useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

app.set('view engine', 'pug');
app.set('views','./views'); //default value

app.use('/api/genres', genres);

app.use('/api/customers', customers);

app.use('/', home);

app.use(express.json());

app.use(express.urlencoded('extended:true'));

app.use(express.static('public'));

app.use(logger); //custom middleware

if(app.get('env') === 'development'){
    app.use(morgan('tiny')); // third party middleware
    console.log("MOrgan Enabled");
}



const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening to the port ${port}`));