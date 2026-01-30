const express = require('express');
const _ = require('lodash');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require ('bcrypt');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cron = require('node-cron');
require('dotenv').config();
const router = require('./routes/routes');
const { swaggerUi, specs } = require('./config/swagger');
const { deleteAllWishes } = require('./controllers/memberControllers');

const app = express();
app.use(morgan('dev'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());

// Serve static files (images and videos)
app.use('/uploads', express.static('uploads'));

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'HNB Family API Documentation'
}));

// API routes
app.use(router);

const port = process.env.PORT || 3008;
const uri = process.env.DBURI;

mongoose.connect(uri)
.then(()=>{
  app.listen(port,'0.0.0.0',()=>{
    console.log("App listening on port "+port)
  })
  
  // Schedule daily cleanup of wishes at midnight (00:00)
  cron.schedule('0 0 * * *', async () => {
    console.log('Running daily wish cleanup...');
    try {
      const deletedCount = await deleteAllWishes();
      console.log(`Daily cleanup completed. Deleted ${deletedCount} wishes.`);
    } catch (error) {
      console.error('Error during daily cleanup:', error);
    }
  }, {
    scheduled: true,
    timezone: "UTC"
  });
  
  console.log('Daily wish cleanup scheduled for midnight UTC');
})
.catch((err)=>{
  console.log("Error in db connection...",err);
})