require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const app = express();

//middleware
app.use(express.json());
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

// routes
app.use('/api/user', userRoutes);

// connect to db
mongoose.connect("mongodb://127.0.0.1:27017/tolosel", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log('Connected ot db & Server running on port 4000!!', process.env.PORT);
        })
    })
    .catch((error) => {
        console.log(error)
    })


