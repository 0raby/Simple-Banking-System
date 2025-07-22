const express = require('express');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
// const swaggerJsdoc = require('swagger-jsdoc');
// const accountRoutes = require('./routes/account');
// const transactionRoutes = require('./routes/transaction');
const YAML = require('yamljs');
const apiSpec = path.join(__dirname, 'docs/openapi.yaml');
const swaggerSpec = YAML.load(apiSpec);

const AppError = require('./utils/AppError');
const OpenApiValidator = require('express-openapi-validator');
const globalErrorHandler = require('./controllers/error');

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//ROUTES

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(
  OpenApiValidator.middleware({
    apiSpec: './docs/openapi.yaml',
    validateRequests: true,
    operationHandlers: path.join(__dirname, 'controllers'),
  })
);

// app.use('/api/accounts/', accountRoutes);
// app.use('/api/transactions/', transactionRoutes);
//for swagger

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
