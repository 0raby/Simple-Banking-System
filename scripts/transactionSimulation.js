const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/transactions';
const NUM_TRANSACTIONS = 10;

const accountIds = [
  '7c83a81b-b302-4d1c-9898-bc65013e42cf',
  'ff404b30-62f5-4d69-9342-44525b090dd0',
];

function getRandomAccount(excludeId) {
  const filtered = accountIds.filter((id) => id !== excludeId);
  return filtered[Math.floor(Math.random() * filtered.length)];
}

function createTransactionPayload(fromId) {
  const toId = accountIds[1];
  const amount = 100;

  return {
    // toAccount: toId,
    amount: amount,
    type: 'WITHDRAWAL',
  };
}

async function sendTransaction(fromId) {
  try {
    const payload = createTransactionPayload(fromId);
    const res = await axios.post(`${BASE_URL}/${fromId}`, payload);
    return res.data;
  } catch (err) {
    return {
      error: err.response?.data || err.message,
    };
  }
}

async function runSimulation() {
  const allTransactions = [];
  const fromId = accountIds[0];
  for (let i = 0; i < NUM_TRANSACTIONS; i++) {
    allTransactions.push(sendTransaction(fromId));
  }

  const results = await Promise.all(allTransactions);
  console.log('Finished 100 transactions');
  const errors = results.filter((r) => r.error);
  console.log(
    `Successful: ${results.length - errors.length}, Failed: ${errors.length}`
  );

  if (errors.length > 0) {
    console.log('Some errors occurred:');
    console.dir(errors.slice(0, 5), { depth: null });
  }
}

runSimulation();
