const mongoose = require('mongoose');
const Account = require('../models/account');
const Transaction = require('../models/transaction');
const AppError = require('../utils/AppError');
const accountRepo = require('./../Repositories/account');
const transactionRepo = require('./../Repositories/transaction');
exports.handleTransfer = async (data, session) => {
  const amount = data.amount;

  const fromAccount = await accountRepo.findById(data.paramUUID, { session });

  const toAccount = await accountRepo.findById(data.toAccountID, { session });

  //check law fi ay moshkela
  if (!fromAccount) {
    throw new AppError('Your account is not found', 404);
  }

  if (!toAccount) {
    throw new AppError(
      'The account you are transfering funds to is not available, please make sure you entered the correct details',
      404
    );
  }

  if (amount > fromAccount.balance) {
    throw new AppError('Insufficient funds', 400);
  }
  //update balance
  fromAccountNewBalance = fromAccount.balance - amount;

  await accountRepo.updateAccountBalance(
    data.paramUUID,
    fromAccountNewBalance,
    { session }
  );

  toAccountNewBalance = toAccount.balance + amount;
  await accountRepo.updateAccountBalance(
    data.toAccountID,
    toAccountNewBalance,
    {
      session,
    }
  );

  const transaction = await transactionRepo.createTransaction(
    {
      fromAccount: data.paramUUID,
      toAccount: data.toAccountID,
      type: 'TRANSFER',
      amount,
    },
    { session }
  );
  // await session.commitTransaction();
  // session.endSession();
  return transaction[0];
};

exports.handleDeposit = async (data, session) => {
  const amount = data.amount;
  //Fetch accounts inside the session
  const toAccount = await accountRepo.findById(data.paramUUID, { session });

  if (!toAccount) {
    return next(
      new AppError(
        "The account you are depositing to is invalid please check the account's id",
        400
      )
    );
  }

  newBalance = toAccount.balance += amount;

  await accountRepo.updateAccountBalance(data.paramUUID, newBalance, {
    session,
  });

  // await toAccount.save({ session });

  const transaction = await transactionRepo.createTransaction(
    {
      toAccount: data.paramUUID,
      type: 'DEPOSIT',
      amount,
    },

    { session }
  );

  return transaction[0];
};

exports.handleWithdrawal = async (data, session) => {
  const amount = data.amount;
  //Fetch accounts inside the session
  const fromAccount = await accountRepo.findById(data.paramUUID, { session });

  if (!fromAccount) {
    return next(
      new AppError(
        "The account you are withdrawing from is invalid please check the account's id",
        400
      )
    );
  }

  if (amount > fromAccount.balance) {
    return next(new AppError('Insuffient funds', 400));
  }

  if (amount > 50000) {
    return next(
      new AppError('Cannot withdraw more than 50,000 per transaction', 400)
    );
  }
  newBalance = fromAccount.balance -= amount;

  await accountRepo.updateAccountBalance(data.paramUUID, newBalance, {
    session,
  });
  const transaction = await transactionRepo.createTransaction(
    {
      fromAccount: data.paramUUID,
      type: 'WITHDRAWAL',
      amount,
    },

    { session }
  );
  return transaction[0];
};

exports.findBankingStats = async (uuid) => {
  const options = [
    {
      $match: {
        $or: [{ fromAccount: uuid }, { toAccount: uuid }],
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $group: {
        _id: '$type',
        numberOfTransactions: { $sum: 1 },
        transactions: {
          $push: {
            fromAccount: '$fromAccount',
            toAccount: '$toAccount',
            amount: '$amount',
            createdAt: '$createdAt',
          },
        },
      },
    },

    {
      $project: {
        _id: 0,
        type: '$_id',
        numberOfTransactions: 1,
        transactions: 1,
      },
    },
  ];
  const stats = await transactionRepo.getBankingStats(options);
  return stats;
};
