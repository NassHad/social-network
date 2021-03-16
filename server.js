require('dotenv').config({path: './config/.env'});
require('./config/db');

const express = require('express');
const UserRoutes = require('./routes/userRoutes');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));



// routes
app.use('/api/user', UserRoutes);

// server
app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
})