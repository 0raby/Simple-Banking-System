module.exports = {
  '/api/transactions/{id}': {
    get: {
      summary: 'Get all transaction for 1 account.',
      tags: ['Transactions'],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          description: 'UUID of the account',
          schema: {
            type: 'string',
            example: '7c83a81b-b302-4d1c-9898-bc65013e42cf',
          },
        },
      ],
      responses: {
        200: {
          description: "Account's Transaction",
          content: {
            'application/json': {
              example: {
                transactions: {},
              },
            },
          },
        },
        400: {
          description: 'Account not found',
          content: {
            'application/json': {
              example: {
                status: 'fail',
                message: 'Fetching transactions failed',
              },
            },
          },
        },
      },
    },
    post: {
      summary:
        'create a transaction (withdrawl, deposit, transfer between 2 accounts)',
      tags: ['Transactions'],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          description: 'MongoDB ID of the account',
          schema: { type: 'string', example: '686d0337c52efd3bdf698d6a' },
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                fromAccount: { type: 'string' },
                toAccount: { type: 'string' },
                amount: { type: 'Number' },
                type: { type: 'string' },
              },
              example: {
                fromAccount: '686d02ebc52efd3bdf698d61',
                toAccount: '686d0337c52efd3bdf698d6a',
                amount: 1500,
                type: 'transfer',
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Transaction complete',
          content: {
            'application/json': {
              example: {
                status: 'success',
                data: { account: {} },
                message: 'Transaction complete',
              },
            },
          },
        },
        400: {
          description: 'Bad request',
          content: {
            'application/json': {
              example: {
                status: 'fail',
                message: 'Transaction failed please try again',
              },
            },
          },
        },
        404: {
          description: 'Your Account is not found',
          content: {
            'application/json': {
              example: {
                status: 'fail',
                message: 'Your account is facing some issue please try again',
              },
            },
          },
        },
        404: {
          description: 'The account you are trying to transafer you is invalid',
          content: {
            'application/json': {
              example: {
                status: 'fail',
                message:
                  'The account you are transfering funds to is not available, please make sure you entered the correct details',
              },
            },
          },
        },
        404: {
          description: 'Insufficient funds',
          content: {
            'application/json': {
              example: {
                status: 'fail',
                message: 'Insufficient funds',
              },
            },
          },
        },
      },
    },
  },
};
