const express = require('express');
const {Genre,validateGenre} = require('../models/genre');
const bodyparser = require('body-parser');

const router = express.Router();

// create application/json parser
var jsonParser = bodyparser.json();
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyparser.urlencoded({ extended: false });

// const genres = [
//     {
//         id: 1,
//         genre: "comedy"
//     },
//     {
//         id: 2,
//         genre: "horror"
//     },
//     {
//         id: 3,
//         genre: "drama"
//     },
//     {
//         id: 4,
//         genre: "romantic"
//     }
// ]





router.get('/', async (req,res) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);
});

router.get('/:id',async (req,res) => {
   // const genre = genres.find(g => parseInt(req.params.id) === g.id);
   const genre = await Genre.findById(req.params.id);

    if(!genre) return res.status(404).send('The genre with given id is not found!');

    res.send(genre);
    
});

router.post('/', jsonParser, async(req,res) => {
    console.log('Validating...');
    const {error} = validateGenre(req.body); // object destructuring
    if(error) return res.status(400).send(error.details[0].message); // 400 - Bad request
    console.log(req);
    try{
        
        let genre = new Genre({ name: req.body.name });
        genre = await genre.save();
        res.send(genre);
    }catch(err) {console.error('Error while saving!' + err.message)};
    
})

router.put('/:id', jsonParser, async (req,res) => {
    //lookup for the genre
   // const genreToUpdate = genres.find(g => g.id === parseInt(req.params.id));
    // if not there throw 404 error
   // if(!genreToUpdate) return res.status(404).send('The genre with given id is not found!');
    // validate 
    const result  = validateGenre(req.body);
    const {error} = validateGenre(req.body); // object destructuring
    //if invalid return 400 error
    if(error) return res.status(400).send(error.details[0].message); // 400 - Bad request
    //update genres
    const genre = await Genre.findByIdAndUpdate(req.params.id, {name: req.body.name}, {new: true});

    if(!genre)  return res.status(404).send('The genre with given id is not found!');

   // genreToUpdate.genre = req.body.genre;
    //return updated genres
    const genres = await Genre.find().sort('name');
    res.send(genres);
})

router.delete('/:id',jsonParser, async(req,res) => {
    //const genreToUpdate = genres.find(g => g.id === parseInt(req.params.id));
    const genreToUpdate = Genre.findByIdAndRemove(req.params.id);
    // if not there throw 404 error
    if(!genreToUpdate) return res.status(404).send('The genre with given id is not found!');

   // const index = genres.indexOf(genreToUpdate);
   // genres.splice(index,1);
   console.log(genreToUpdate);
   const genres = await Genre.find().sort('name');
   res.send(genres);
   
})

module.exports = router;