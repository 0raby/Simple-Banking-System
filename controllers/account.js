const Account = require('../models/account');
const APIFeatures = require('../utils/APIFeatures');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const accountService = require('../services/account');
const VeryifyID = require('./../utils/VerifyEgyptianID');
const { isUUID } = require('validator');

exports.getAllAccounts = catchAsync(async (req, res) => {
  let accounts = await accountService.getAllAccounts(req.query);

  res.status(200).json({
    results: accounts.length,
    accounts,
  });
});
exports.getAccount = catchAsync(async (req, res, next) => {
  const uuid = req.params.id;

  const account = await accountService.getAccountById(uuid);

  res.status(200).json(account);
});

exports.createAccount = catchAsync(async (req, res, next) => {
  const { name, nationalID } = req.body;

  VeryifyID(nationalID);

  const newAccount = await accountService.createAccount(name, nationalID);
  //new Account ={name, creditcardno, cvv, exp date, balance}
  res.status(201).json(newAccount);
});

exports.updateAccount = catchAsync(async (req, res, next) => {
  const uuid = req.params.id;
  const name = req.body.name;
  // if (!uuid || !isUUID(uuid)) {
  //   next(new AppError('Please enter the correct UUID', 400));
  // }

  // if (!name) {
  //   next(new AppError('You can only update the name, so please enter it', 400));
  // }
  const updatedAccount = await accountService.updateAccount(uuid, name);
  res.status(200).json({ updatedAccount });
});

exports.deleteAccount = catchAsync(async (req, res, next) => {
  const uuid = req.params.id;
  await accountService.deleteAccount(uuid);
  res.status(204).json({});
});
