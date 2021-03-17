require('dotenv').config({path: './config/.env'});
require('./config/db');

const express = require('express');
const UserRoutes = require('./routes/userRoutes');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { checkUser, requireAuth } = require('./middleware/authMiddleware');
const app = express();

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

// server
app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
})