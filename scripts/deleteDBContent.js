const mongoose = require('mongoose');
const Account = require('../models/accountModel');
const Transaction = require('../models/transactionModel');
async function deleteAll() {
  await Account.deleteMany({});
  await Transaction.deleteMany({});
}

deleteAll();
