const express = require('express')
const app= express()
const server= require('./server/db')
const Person = require('./models/person')

//Create and Save a Record of a Model
app.post('/', (req,res) =>{
    const newPerson = new Person({
        name: 'Houssam',
        age: 32,
        favoriteFoods: ['viande']
    })
    newPerson.save(function(err,data){
        if (err) console.error
        res.json(data)
    })
})

//Create Many Records with model.create()
app.post('/many', (req,res) =>{
    const arrayOfPeople= 
    [{
        name: 'Mina',
        age: 13,
        favoriteFoods: ['chocolat','riz','banane']
    },
    {
        name: 'Cohen',
        age: 22,
        favoriteFoods: ['pastilla','tajine','couscous']
    },
    {
        name: 'julien',
        age: 44,
        favoriteFoods: ['saumon','steak']
    }]
    
    Person.create(arrayOfPeople, (err, data)=>{
        if (err) console.error
        res.json(data)
    })
})

//Find all the people having a given name
app.get('/Name/:name', (req,res)=>{
    Person.find({name: req.params.name}, (err,data)=>{
        if (err) console.error
        res.json(data)
    })
})

//Find just one person which has a certain food in the person's favorites
app.get('/Food/:food', (req,res)=>{
    Person.findOne({favoriteFoods: {$all: [req.params.food]}}, (err,data)=>{
        if (err) console.error;
        res.json(data)
    })
})

//Find the (only!!) person having a given _id, using Model.findById() -> Person
app.get('/Id/:id', (req,res)=>{
    const personId = req.params.id
    Person.findById({_id: personId}, (err,data)=>{
        if (err) console.error; 
        res.json(data)
    })
})

//Perform Classic Updates by Running Find, Edit, then Save
app.put('/:id', (req,res)=>{
    const personId = req.params.id
    Person.findById({_id: personId}, (err,data)=>{
        if (err) console.error; 
        data.favoriteFoods.push("hamburger")
        data.save()
        res.json(data)
    })
})

//Perform New Updates on a Document Using model.findOneAndUpdate()
app.put('/Name/:name', (req,res)=>{
    Person.findOneAndUpdate({name: req.params.name}, {$set: {age: 20}}, {new: true}, (err,data) =>{
        if (err) console.error;
        res.json(data)
    })
})

//Delete One Document Using model.findByIdAndRemove
app.delete('/:id', (req,res)=>{
    const personId = req.params.id
    Person.findByIdAndRemove({_id: personId}, (err,data)=>{
        if (err) console.error;
        res.json(data)
    })
})

//Delete Many Documents with model.remove()
app.delete('/many/:name', (req,res)=>{
    const personName = req.params.name
    Person.remove({name: personName},(err,data)=>{
        if (err) console.error;
        res.json(data)
    })
})

//Chain Search Query Helpers to Narrow Search Results
app.get('/search', (req,res)=>{
    Person.find({favoriteFoods: {$all: ['burritos']}})
    .sort({name: 1})
    .limit(2)
    .select({age: false})
    .exec()
    .then(data=>res.json(data))
    .catch(err=>console.error) 
})

app.listen(3000, ()=>{
    console.log('Connected to http://localhost:3000')
})