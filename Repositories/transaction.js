const Transaction = require('../models/transaction');

exports.createTransaction = (transactionData, options = {}) => {
  return Transaction.create([transactionData], options);
};

exports.getBankingStats = (options = {}) => {
  return Transaction.aggregate(options);
};
