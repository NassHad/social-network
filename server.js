require('dotenv').config({path: './config/.env'});
require('./config/db');

const express = require('express');
const path = require('path');
const UserRoutes = require('./routes/userRoutes');
const PostRoutes = require('./routes/postRoutes');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { checkUser, requireAuth } = require('./middleware/authMiddleware');
const cors = require('cors');

const app = express();

const corsOptions = {
    origin: "*",
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId'],
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
}

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());

// jwt
app.get('*', checkUser);
app.get('/jwtid', requireAuth, (req, res) => {
    res.status(200).send(res.locals.user._id);
})

// routes
app.use('/api/user', UserRoutes);
app.use('/api/post', PostRoutes);

app.use(express.static('client/build'));

app.get('/', (_,res) => {
    res.send('Hello to Social-Network API');
})

// server
app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
})