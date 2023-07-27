const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');

app.use(bodyParser.json());

const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            // password: 'cookies',
            entries: 0,
            joined: new Date()
        },

        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            // password: 'banana',
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: '987',
            hash: '',
            email: 'john@gmail.com'
        }
    ]
}

app.get('/', (req, res) => {
    res.send(database.users);
})

app.post('/signin', (req, res) => {
    bcrypt.compare("apples", '$2a$10$JbTsCcqx.VFk4lBjUbx6HeYcaV3nCNDCU0H3OEA7cQ9tXto8.iWZK', function(err, res) {
        // res == true
        console.log('first guess', res)
    });
    bcrypt.compare("veggies", '$2a$10$JbTsCcqx.VFk4lBjUbx6HeYcaV3nCNDCU0H3OEA7cQ9tXto8.iWZK', function(err, res) {
        // res = false
        console.log('second guess', res)

    });
    if(req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
        res.json("success");
    } else {
        res.status(404).json('error loggin in')
    }
})


app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    bcrypt.hash(password, null, null, function(err, hash) {
        // Store hash in your password DB.
        console.log(hash);
    });
    database.users.push({
        id: '125',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    })

    res.json(database.users[database.users.length - 1]);
})


app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(users => {
        if(users.id === id){
            found = true;
            return res.json(users);
        } 
    })
    if (!found) {
        res.status(400).json("not found");
      }
})

app.post('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(users => {
        if(users.id === id){
            found = true;
            users.entries++
            return res.json(users.entries);
        } 
    })
    if (!found) {
        res.status(400).json("not found");
      }
})



app.listen(3000, () => {
    console.log('Runnning on port 3000');
})

/*
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user
*/