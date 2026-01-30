const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HNB Family API',
      version: '1.0.0',
      description: 'API documentation for Hope News Box Family Application',
      contact: {
        name: 'HNB Team',
        email: 'ntwaliyanis@gmail.com'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? `${process.env.RENDER_EXTERNAL_URL || 'your-app-name.onrender.com'}`
          : 'http://localhost:3008',
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        LoginRequest: {
          type: 'object',
          required: ['userType'],
          properties: {
            userType: {
              type: 'string',
              enum: ['guest', 'member'],
              description: 'Type of user login'
            },
            familyName: {
              type: 'string',
              description: 'Required for member login'
            }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              description: 'JWT authentication token'
            },
            role: {
              type: 'string',
              enum: ['guest', 'member'],
              description: 'User role'
            },
            message: {
              type: 'string',
              description: 'Welcome message'
            }
          }
        },
        Profile: {
          type: 'object',
          required: ['email', 'birthday', 'subFam'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            birthday: {
              type: 'string',
              format: 'date',
              description: 'User birthday (must be in the past)'
            },
            subFam: {
              type: 'string',
              description: 'Sub-family identifier'
            },
            profilePic: {
              type: 'string',
              description: 'Profile picture URL or file path'
            }
          }
        },
        Birthday: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Name of person with birthday'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js', './controllers/*.js'], 
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs
};
