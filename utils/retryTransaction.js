// utils/withRetryTransaction.js
async function withRetryTransaction(operationFn, session, retries = 5) {
  for (let i = 0; i < retries; i++) {
    try {
      await session.withTransaction(operationFn);
      return;
    } catch (err) {
      if (err.code === 112 && i < retries - 1) {
        console.warn(
          `Write conflict, retrying transaction (${i + 1}/${retries})...`
        );
        await new Promise((res) => setTimeout(res, 100 * (i + 1))); // exponential backoff
      } else {
        throw err;
      }
    }
  }
  throw new Error('Transaction failed after max retries');
}

module.exports = withRetryTransaction;
