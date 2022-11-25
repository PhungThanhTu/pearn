const swaggerDoc = require('swagger-jsdoc');

const options = {
    failOnErrors: true, // Whether or not to throw when parsing errors. Defaults to false.
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Pearn API Swagger documentation',
        version: '1.0.0',
      },
      components: {
        securitySchema:{
            bearerAuth: {
                type:'http',
                scheme: 'bearer',
                bearerFormat: "JWT"
            }
        }
    },
    security: [
        {
            bearerAuth: []
        }
    ],
    },
    apis: [
        './src/routes/*.js',
    ]

}
  
  const swaggerJson = swaggerDoc(options);


  module.exports = {
    swaggerJson
  }