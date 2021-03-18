const mongoose = require("mongoose");

mongoose
    .connect('mongodb+srv://'+ process.env.DB_USER + ':' + process.env.DB_PASSWORD + '@node.h3omc.mongodb.net/mern-project',
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        }
    )
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log('Failed to connect to mongoDB', err));
