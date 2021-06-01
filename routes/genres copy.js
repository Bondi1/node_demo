const express = require('express');

const router = express.Router();

const genres = [
    {
        id: 1,
        genre: "comedy"
    },
    {
        id: 2,
        genre: "horror"
    },
    {
        id: 3,
        genre: "drama"
    },
    {
        id: 4,
        genre: "romantic"
    }
]


function validateGenre(genre) {
    const schema = Joi.object({
        genre : Joi.string().min(3).required()
    });

    return schema.validate(genre);
}

router.get('/', (req,res) => {
    res.send(genres);
});

router.get('/:id',(req,res) => {
    const genre = genres.find(g => parseInt(req.params.id) === g.id);

    if(!genre) return res.status(404).send('The genre with given id is not found!');

    res.send(genre);
    
});

router.post('/', (req,res) => {
    const {error} = validateGenre(req.body); // object destructuring
    if(error) return res.status(400).send(error.details[0].message); // 400 - Bad request
    
    const genre = {
        id : genres.length + 1,
        genre: req.body.genre
    }
    genres.push(genre);
    res.send(genre);
})

router.put('/:id', (req,res) => {
    //lookup for the genre
    const genreToUpdate = genres.find(g => g.id === parseInt(req.params.id));
    // if not there throw 404 error
    if(!genreToUpdate) return res.status(404).send('The genre with given id is not found!');
    // validate 
    const result  = validateGenre(req.body);
    const {error} = validateGenre(req.body); // object destructuring
    //if invalid return 400 error
    if(error) return res.status(400).send(error.details[0].message); // 400 - Bad request
    //update genres
    genreToUpdate.genre = req.body.genre;
    //return updated genres
    res.send(genres);
})

router.delete('/:id', (req,res) => {
    const genreToUpdate = genres.find(g => g.id === parseInt(req.params.id));
    // if not there throw 404 error
    if(!genreToUpdate) return res.status(404).send('The genre with given id is not found!');

    const index = genres.indexOf(genreToUpdate);
    genres.splice(index,1);
    res.send(genres);
})

module.exports = router;