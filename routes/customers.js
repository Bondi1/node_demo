const {Customer,validateCustomer} = require('../models/customer');
const express = require('express');
const bodyparser = require('body-parser');
const router = express.Router();

var jsonParser = bodyparser.json();
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyparser.urlencoded({ extended: false });



router.get('/',jsonParser, async (req, res) => {
  const customers = await Customer.find().sort('name');
  res.send(customers);
});

router.post('/',jsonParser, async (req, res) => {
  //console.log(req);
  const { error } = validateCustomer(req.body); 
  console.log(error);                           
  if (error) return res.status(400).send(error.details[0].message);

  //console.log(req.headers);
  let customer = new Customer({ 
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone
  });
  customer = await customer.save();
  
  res.send(customer);
});

router.put('/:id',jsonParser, async (req, res) => {
  const { error } = validateCustomer(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(req.params.id,
    { 
      name: req.body.name,
      isGold: req.body.isGold,
      phone: req.body.phone
    }, { new: true });

  if (!customer) return res.status(404).send('The customer with the given ID was not found.');
  
  res.send(customer);
});

router.delete('/:id',jsonParser, async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);

  if (!customer) return res.status(404).send('The customer with the given ID was not found.');

  res.send(customer);
});

router.get('/:id', async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) return res.status(404).send('The customer with the given ID was not found.');

  res.send(customer);
});



module.exports = router; 