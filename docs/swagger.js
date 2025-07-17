const accountDocs = require('./modelDocs/accountDocs');
const transaferDocs = require('./modelDocs/transactionDocs');
module.exports = {
  openapi: '3.0.0',
  info: {
    title: 'Bank API',
    version: '1.0.0',
    description: 'A simple banking system API',
  },
  servers: [
    {
      url: 'http://localhost:3000',
    },
  ],
  paths: {
    ...accountDocs,
    ...transaferDocs,
  },
  //   apis: ['./routes/*.js'],
};
