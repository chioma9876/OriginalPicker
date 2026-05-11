const express = require('express');
require('dotenv').config();
const PORT = process.env.PORT || 5945;
const app = express();
app.use(express.json());
require('./database/database');
const userRouter = require('./routes/userRouter')
const restaurantRouter = require('./routes/restaurant')
const orderRouter = require('./routes/order')
const location = require('./routes/location')
const weather = require('./routes/weather')
// const facebookRoute = require('./routes/facebook')
const expressSession = require('express-session')
const passport = require('passport');
// require('./controller/passport')
// require('./controller/facebook')
// require('./controller/github')
const swaggerUI = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');


app.use(expressSession({secret: 'chioma', saveUninitialized: false, resave: false}));
app.use(passport.initialize());
app.use(passport.session())
app.use('/api/v1/user',userRouter);
app.use('/api/v1/location', location);
app.use('/api/v1/weather', weather);
// app.use('/api/v1/users',facebookRoute);
app.use('/api/v1/restaurant', restaurantRouter);
app.use('/api/v1/order', orderRouter);

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Picker Web Application',
    version: '2.0.0',
    description:
      'This is a REST API application made with Express. It retrieves data from JSONPlaceholder.',
    license: {
      name: 'Official URL',
      url: 'https://google.com',
    },
    contact: {
      name: 'JSONPlaceholder',
      url: 'https://jsonplaceholder.typicode.com',
    },
  },
  servers: [
    {
      url: 'https://originalpicker-1.onrender.com',
      description: 'Development server',
    },
  ],
  security: [
    {
        bearerAuth: []
    }
  ],
  components: {
    securitySchemes: {
        bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
        }
    }
  }
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

app.use('/api/v1/documentations', swaggerUI.serve, swaggerUI.setup(swaggerSpec))

//app.use('/api/v2/documentation', swaggerUI.serve, swaggerUI.setup(swaggerSpec))

app.use((error, req, res, next)=> {
    console.log(error);
    res.status(error.statusCode).json({
        message: error.message,
        status: error.statusCode
    })
})
// app.use((req, res, next) => {
//     if (err.name === 'MulterError'){
//         return res.status(400).json({
//             message: 'File upload failed',
//         })
//     }
//     if (err.name === 'JsonWebTokenError'){
//         return res.status(401).json({
//             message: 'Session expired, please login again',
//         })
//     }
//     res.status(500).json({
//         message: err.message,
//     })
// })

const mongoose = require('mongoose');
app.use((req, res, next) => {
    res.status(500).json({
        message: `route ${req.originalUrl} and ${req.method} not found`
    })
})


mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log('Database connected successfully');
    app.listen(PORT, ()=> {
        console.log(`Server listening to Port: ${PORT}`);
    })
    
})
.catch((error) => {
    console.log(error.message);
    
})

