const Transaction = require('../models/transaction');
const mongoose = require('mongoose');
const Account = require('../models/account');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const withRetryTransaction = require('../utils/retryTransaction');
const transactionService = require('../services/transaction');
const { isUUID } = require('validator');
// const transactionFunc =
exports.createTransaction = catchAsync(async (req, res, next) => {
  let transaction;
  const paramUUID = req.params.id;
  const transactionType = req.body.type;
  const amount = req.body.amount;

  // if (!transactionType) {
  //   return next(new AppError('Please specifiy a transaction type', 400));
  // }

  // if (
  //   transactionType !== 'TRANSFER' &&
  //   transactionType !== 'WITHDRAWAL' &&
  //   transactionType !== 'DEPOSIT'
  // ) {
  //   return next(new AppError('Please enter a valid transaction type', 400));
  // }

  // if (!paramUUID) {
  //   return next(new AppError('Please enter your id in the URL params', 400));
  // }
  // if (!isUUID(paramUUID)) {
  //   return next(new AppError('Please enter your correct id', 400));
  // }
  // if (!amount) {
  //   return next(new AppError('Please specify an amount', 400));
  // }
  // if (amount < 10) {
  //   return next(
  //     new AppError(
  //       'The min amount for any transaction should be greater than or equal to 10',
  //       400
  //     )
  //   );
  // }
  const session = await mongoose.startSession();

  if (transactionType === 'TRANSFER') {
    const toAccountID = req.body.toAccount;
    if (!toAccountID) {
      return next(
        new AppError(
          'Please enter the ID of the account you want to transfer to',
          400
        )
      );
    }
    if (!isUUID(toAccountID)) {
      return next(
        new AppError(
          'Please enter the correct ID of the account you want to transfer to',
          400
        )
      );
    }

    await withRetryTransaction(async () => {
      transaction = await transactionService.handleTransfer(
        { paramUUID, toAccountID, amount },
        session
      );
    }, session);
  } else if (transactionType === 'DEPOSIT') {
    await withRetryTransaction(async () => {
      transaction = await transactionService.handleDeposit(
        { paramUUID, amount },
        session
      );
    }, session);
  } else if (transactionType === 'WITHDRAWAL') {
    await withRetryTransaction(async () => {
      transaction = await transactionService.handleWithdrawal(
        { paramUUID, amount },
        session
      );
    }, session);
  }
  // "transaction": {
  //       "fromAccount": "5a2f9d98-7e07-4732-b19b-6caccee430c8",
  //       "amount": 2000,
  //       "type": "WITHDRAWAL",
  //       "_id": "687e368e39d3fa2ee07f0600",
  //       "id": "56c8add9-2976-44d5-89f3-d4cd1d507a7c",
  //       "createdAt": "2025-07-21T12:46:06.909Z",
  //       "__v": 0
  //   }
  const { id, fromAccount, toAccount, type, createdAt } = transaction;
  return res
    .status(201)
    .json({ id, fromAccount, toAccount, type, amount, createdAt });
});

exports.getAccountTransactions = catchAsync(async (req, res, next) => {
  const uuid = req.params.id;
  if (!uuid) {
    return next(
      new AppError('Please enter your id to get your banking stats', 400)
    );
  }
  if (!isUUID(uuid)) {
    return next(
      new AppError('Please make sure that the id you entered is correct', 400)
    );
  }
  const stats = await transactionService.findBankingStats(uuid);
  const { numberOfTransactions, transactions } = stats[0];

  res.status(200).json({ UserId: uuid, numberOfTransactions, transactions });
});
